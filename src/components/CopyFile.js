import React, { useState } from 'react';
import { CopyObjectCommand } from "@aws-sdk/client-s3";
import s3 from '../utils/s3Client';

function CopyFile() {
    const [sourceBucket, setSourceBucket] = useState("");
    const [sourceKey, setSourceKey] = useState("");
    const [destinationBucket, setDestinationBucket] = useState("");
    const [destinationKey, setDestinationKey] = useState("");
    const [copyStatus, setCopyStatus] = useState("");

    const handleCopy = async () => {
        const copySource = `${sourceBucket}/${sourceKey}`;
        const params = {
            CopySource: copySource,
            Bucket: destinationBucket,
            Key: destinationKey,
        };

        try {
            const command = new CopyObjectCommand(params);
            const response = await s3.send(command);
            console.log("复制文件成功：", response);
            setCopyStatus("复制文件成功!");
            setTimeout(() => {
                setCopyStatus("");
            }, 3000);
        } catch (err) {
            console.error("复制文件失败：", err);
            setCopyStatus("复制文件失败");
            setTimeout(() => {
                setCopyStatus("");
            }, 3000);
        }
    };

    return (
        <div>
            <style>
                {`
                .form-group {
                    margin-bottom: 20px; /* 将间距设置为 20px */
                }
                `}
            </style>

            <h2>文件拷贝</h2>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Source Bucket"
                    value={sourceBucket}
                    onChange={(e) => setSourceBucket(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Source Key"
                    value={sourceKey}
                    onChange={(e) => setSourceKey(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Destination Bucket"
                    value={destinationBucket}
                    onChange={(e) => setDestinationBucket(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Destination Key"
                    value={destinationKey}
                    onChange={(e) => setDestinationKey(e.target.value)}
                    className="form-control"
                />
            </div>
            <button onClick={handleCopy} className="btn btn-primary">拷贝文件</button>
            <p>{copyStatus}</p>
        </div>
    );
}

export default CopyFile;
