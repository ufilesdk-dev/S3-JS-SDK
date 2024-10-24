import React, { useState } from 'react';
import { RestoreObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import s3 from '../utils/s3Client';

function RestoreObject() {
    const [bucketName, setBucketName] = useState("");
    const [keyName, setKeyName] = useState("");
    const [restoreStatus, setRestoreStatus] = useState("");

    const handleRestore = async () => {
        setRestoreStatus("发送解冻请求...");

        const restoreRequest = {
            Days: 3,
        };

        const params = {
            Bucket: bucketName,
            Key: keyName,
            RestoreRequest: restoreRequest,
        };

        try {
            const restoreCommand = new RestoreObjectCommand(params);
            const restoreResponse = await s3.send(restoreCommand);
            console.log("解冻请求发送成功:", restoreResponse);
            setRestoreStatus("解冻请求发送成功!");
            // 延迟检查恢复状态
            setTimeout(() => {
                checkRestorationStatus(bucketName, keyName);
            }, 3000); // 3 秒延迟

        } catch (err) {
            console.error("解冻对象出错:", err);
            setRestoreStatus("解冻对象出错");
            setTimeout(() => {
                setRestoreStatus("");
            }, 3000);
        }
    };

    const checkRestorationStatus = async (bucketName, keyName) => {
        try {
            const headParams = {
                Bucket: bucketName,
                Key: keyName,
            };

            const headCommand = new HeadObjectCommand(headParams);
            const headResponse = await s3.send(headCommand);

            if (headResponse.Restore) {
                const match = headResponse.Restore.match(/ongoing-request="(\w+)"/);
                const isInProgress = match && match[1] === "true";
                const status = isInProgress ? "in-progress" : "finished";
                console.log(`解冻状态: ${status}`);
                setRestoreStatus(`解冻状态: ${status}`);
            } else {
                setRestoreStatus("未找到解冻请求或解冻已完成");
            }
        } catch (err) {
            console.error("检查解冻状态出错:", err);
            setRestoreStatus("检查解冻状态出错");
        }

        setTimeout(() => {
            setRestoreStatus("");
        }, 3000);
    };

    return (
        <div>
            <h2>文件解冻</h2>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Bucket Name"
                    value={bucketName}
                    onChange={(e) => setBucketName(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Key Name"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    className="form-control"
                />
            </div>
            <button onClick={handleRestore} className="btn btn-primary">执行解冻</button>
            <p>{restoreStatus}</p>
        </div>
    );
}

export default RestoreObject;
