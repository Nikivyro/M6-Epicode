import React, { useState } from 'react';
import AxiosClient from '../client/client';
const client = new AxiosClient();

export default function AddPostModal({ closeModal }) {
    const [formData, setFormData] = useState({});
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // Aggiunto stato per l'anteprima dell'immagine

    const onChangeSetFile = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        // Mostra un'anteprima dell'immagine
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
        };
        reader.readAsDataURL(selectedFile);
    }

    const uploadFile = async (cover) => {
        const fileData = new FormData();
        fileData.append('cover', cover);

        try {
            const response = await fetch(`${process.env.REACT_APP_URL_ENDPOINT}/posts/cloudUpload`, {
                method: "POST",
                body: fileData
            });
            return await response.json();
        } catch (error) {
            console.error(error, 'Errore in uploadFile');
            throw error;
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!file) {
                console.error('Caricare almeno un file');
                return;
            }

            // Upload del file
            const uploadCover = await uploadFile(file);
            console.log(uploadCover);

            // Parse the readTime input values as numbers
            const readTimeValue = Number(formData.readTimeValue);
            // Set readTime as an object with value and unit
            const readTimeUnit = formData.readTimeUnit || 'minuti';
            const readTime = { value: readTimeValue, unit: readTimeUnit };
            const { readTimeValue: _, readTimeUnit: __, ...restData } = formData;

            const postData = {
                ...restData,
                readTime,
                cover: uploadCover.cover
            };

            const response = await fetch(`${process.env.REACT_APP_URL_ENDPOINT}/posts/create`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: 'POST',
                body: JSON.stringify(postData)
            });

            if (response.ok) {
                closeModal(false); // Chiudi il modal se la richiesta è andata a buon fine
            } else {
                console.error('Errore nella richiesta di creazione del post.');
            }
        } catch (error) {
            console.error(error);
            // Gestisci l'errore come necessario
        }
    };

    return (
        <div className="h-screen w-screen fixed top-1/2 flex items-center left-1/2 backdrop-blur-lg transform -translate-y-1/2 -translate-x-1/2 z-30">
            <div className="fixed z-10 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-100 shadow-xl w-fit min-w-[500px] h-fit p-4 rounded-xl hover:scale-110 duration-1000">
                <h1 className="font-bold text-4xl mb-4 text-orange-700 text-center">
                    Aggiungi post
                </h1>
                <div className="w-full h-fit p-4 rounded-lg flex justify-center items-center">
                    <form
                        onSubmit={onSubmit}
                        className="flex flex-col justify-center items-center gap-4">
                        <input
                            placeholder='Titolo post'
                            className="w-[400px] p-1 rounded"
                            name="title"
                            type="text"
                            onChange={(e) => setFormData({
                                ...formData,
                                title: e.target.value
                            })}
                        />
                        <input
                            placeholder='Categoria post'
                            className="w-[400px] p-1 rounded"
                            name="category"
                            type="text"
                            onChange={(e) => setFormData({
                                ...formData,
                                category: e.target.value
                            })}
                        />
                        {/* Mostra l'anteprima dell'immagine se disponibile */}
                        {imagePreview && (
                            <img src={imagePreview} alt="Anteprima immagine" style={{ maxWidth: "100%" }} />
                        )}
                        <input
                            className="w-[400px] p-1 rounded"
                            name="cover"
                            type="file"
                            onChange={onChangeSetFile}
                        />
                        <input
                            placeholder='Tempo di lettura (valore)'
                            className="w-[400px] p-1 rounded"
                            name="readTimeValue"
                            type="number"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    readTimeValue: e.target.value,
                                })
                            }
                        />
                        <input
                            placeholder='Tempo di lettura (unità)'
                            className="w-[400px] p-1 rounded"
                            name="readTimeUnit"
                            type="text"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    readTimeUnit: e.target.value,
                                })
                            }
                        />
                        <input
                            placeholder='Rating'
                            className="w-[400px] p-1 rounded"
                            name="rate"
                            type="number"
                            onChange={(e) => setFormData({
                                ...formData,
                                rate: Number(e.target.value)
                            })}
                        />
                        <input
                            placeholder='Nome author'
                            className="w-[400px] p-1 rounded"
                            name="author"
                            type="text"
                            onChange={(e) => setFormData({
                                ...formData,
                                author: e.target.value
                            })}
                        />
                        <textarea
                            placeholder='Messaggio...'
                            className="w-[400px] p-1 rounded"
                            name="content"
                            onChange={(e) => setFormData({
                                ...formData,
                                content: e.target.value
                            })}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => closeModal(false)}
                                className="p-2 bg-amber-700 text-white rounded">
                                Chiudi
                            </button>
                            <button type="submit" className="p-2 bg-green-700 text-white rounded">
                                Aggiungi
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}