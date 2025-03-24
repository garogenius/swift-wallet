import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const CreateWallet = () => {
    const [pin, setPin] = useState('');
    const [keyPhrase, setKeyPhrase] = useState<string[]>([]);
    const [step, setStep] = useState(1);
    const [publicKey, setPublicKey] = useState('');
    const [phraseInputs, setPhraseInputs] = useState(['', '', '']);
    const [phrasePositions, setPhrasePositions] = useState<number[]>([]);

    const navigate = useNavigate();

    const handleCreateWallet = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/wallet/create-step1', { pin });
            setKeyPhrase(response.data.keyPhrase);
            setPublicKey(response.data.publicKey);

            // Ask for 3 random phrase positions to verify
            const randomPositions = [2, 7, 5]; 
            setPhrasePositions(randomPositions);

            setStep(2);
        } catch (error) {
            alert("Error creating wallet");
        }
    };

    const handleVerifyPhrase = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/wallet/create-step2', {
                publicKey,
                enteredPhrases: phraseInputs,
                positions: phrasePositions
            });

            alert(response.data.message);
            navigate('/dashboard'); // Redirect to dashboard
        } catch (error) {
            alert("Phrase verification failed.");
        }
    };

    return (
        <div className="p-6">
            {step === 1 ? (
                <>
                    <h2 className="text-2xl font-bold mb-4">Create Wallet</h2>
                    <input
                        type="password"
                        placeholder="Enter PIN (4 digits)"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                    <button onClick={handleCreateWallet} className="bg-blue-500 text-white p-2 rounded mt-4">
                        Next
                    </button>
                </>
            ) : (
                <>
                    <h2 className="text-2xl font-bold mb-4">Save Your Key Phrase</h2>
                    <p className="text-red-500 mb-4">Save or screenshot the following phrase:</p>
                    <div className="p-4 bg-gray-200 rounded">
                        {keyPhrase.join(' ')}
                    </div>

                    <h3 className="mt-6">Enter words {phrasePositions.join(', ')}</h3>
                    {phrasePositions.map((pos, index) => (
                        <input
                            key={index}
                            type="text"
                            placeholder={`Word ${pos}`}
                            value={phraseInputs[index]}
                            onChange={(e) => {
                                const newInputs = [...phraseInputs];
                                newInputs[index] = e.target.value;
                                setPhraseInputs(newInputs);
                            }}
                            className="border p-2 rounded w-full mt-2"
                        />
                    ))}

                    <button onClick={handleVerifyPhrase} className="bg-green-500 text-white p-2 rounded mt-4">
                        Verify & Create Wallet
                    </button>
                </>
            )}
        </div>
    );
};

export default CreateWallet;
