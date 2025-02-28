"use client"; // Ensure it's a Client Component in Next.js App Router

import { useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "./ui/use-toast";
import { getAptosClient } from "@/lib/aptos";
import { TransactionOnExplorer } from "./ExplorerLink";
import { submitCampaignData } from "@/entry-functions/submitCampaginData";
import * as filestack from 'filestack-js';
import { saveToDatabase } from "@/lib/firebase";

// Optionally, import a spinner component
import { CircleLoader } from 'react-spinners';

const UploadForm = ({ campaignId }: { campaignId: number }) => {
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [hash, setHash] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false); // State for loading spinner
    const { connected, account, signAndSubmitTransaction, network, wallet } = useWallet();
    const queryClient = useQueryClient();

    const handleUpload = async () => {
        if (!file || !wallet) {
            alert("Please select a file and connect wallet");
            return;
        }

        setLoading(true); // Start loading

        const formData = new FormData();
        formData.append("file", file);

        try {
            // Create a FormData object to append the file

            const client = filestack.init('A9QWDyTvBRhCV72mVLVnQz');

            const res = await client.upload(file, {}, {});

            // Get the uploaded image URL from Filestack response
            const uploadedImageUrl: string | undefined = res?.url ?? res?.data?.url ?? "";  // Filestack response contains the URL in the `url` field
            
            // Step 2: Generate SHA-256 hash of the file
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onloadend = async () => {
                const wordArray = CryptoJS.lib.WordArray.create(reader.result as ArrayBuffer);
                const fileHash = CryptoJS.SHA256(wordArray).toString();

                console.log("File Hash:", fileHash);
                console.log("Uploaded Image URL:", uploadedImageUrl);

                // Step 3: Store the hash and image URL in Firebase Firestore
                await saveToDatabase(fileHash, uploadedImageUrl ?? "");

                // Step 4: Store the hash on the Aptos blockchain
                signAndSubmitTransaction(
                    submitCampaignData({
                        campaignId: campaignId,
                        hash: fileHash,
                    })
                )
                    .then((committedTransaction) => {
                        console.log("Aptos Faucet Client:", getAptosClient().faucet);
                        return getAptosClient().waitForTransaction({
                            transactionHash: committedTransaction.hash,
                        });
                    })
                    .then((executedTransaction) => {
                        toast({
                            title: "Success",
                            description: (
                                <TransactionOnExplorer hash={executedTransaction.hash} />
                            ),
                        });
                        setHash(fileHash);
                        setImageUrl(uploadedImageUrl ?? "");
                        // Wait before invalidating queries
                        return new Promise((resolve) => setTimeout(resolve, 3000));
                    })
                    .then(() => {
                        // Invalidate queries related to messages (or relevant data)
                        return queryClient.invalidateQueries({ queryKey: ["messages"] });
                    })
                    .catch((error) => {
                        console.error("Error during transaction:", error);
                        setHash("Error on blockchain submission");
                        toast({
                            title: "Error",
                            description: "Failed to submit the campaign to the blockchain",
                        });
                    })
                    .finally(() => {
                        setLoading(false); // End loading
                    });
            };

        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed, please try again.");
            setLoading(false); // End loading on error
        }
    };

    return (
        <div>
            <div><input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} /></div>
            <div className="mt-5">
                <button
                    className="bg-green-500 text-white px-2 py-2 rounded-md"
                    style={{ fontSize: "0.75rem" }}
                    onClick={handleUpload}
                    disabled={loading} // Disable button during loading
                >
                    {loading ? "Uploading..." : "Upload & Store Hash"}
                </button>

                {/* Display loading spinner */}
                {loading && (
                    <div className="mt-3" style={{justifyItems: "center"}}>
                        <CircleLoader color="#4B9B4D" loading={loading} size={50} />
                    </div>
                )}

                {imageUrl && <p className="mt-4">Image URL: <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a></p>}
                {hash && <p className="mt-2">Hash: {hash}</p>}
            </div>
        </div>
    );
};

export default UploadForm;
