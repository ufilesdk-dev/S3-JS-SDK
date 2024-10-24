import React from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';
import UploadFile from './components/UploadFile';
import DownloadFile from './components/DownloadFile';
import CopyFile from './components/CopyFile';
import UpdateStorageClass from './components/UpdateStorageClass';
import RestoreObject from './components/RestoreObject';
import MultipartUpload from './components/MultipartUpload';
import DeleteObjects from './components/DeleteObjects';
import GetObjectAcl from './components/GetObjectAcl';
import GetObjectAttr from './components/GetObjectAttr';
import ListObjects from './components/ListObjects';

function App() {
        return (
            <Container className="mt-4">
                    <h1>AWS-JS-S3 文件管理</h1>
                    <Tabs defaultActiveKey="upload" id="file-management-tabs" className="mb-3">
                            <Tab eventKey="upload" title="普通上传">
                                    <UploadFile />
                            </Tab>
                            <Tab eventKey="download" title="文件下载">
                                    <DownloadFile />
                            </Tab>
                            <Tab eventKey="copy" title="文件拷贝">
                                    <CopyFile />
                            </Tab>
                            <Tab eventKey="update-storage-class" title="存储类型转换">
                                    <UpdateStorageClass />
                            </Tab>
                            <Tab eventKey="restore" title="文件解冻">
                                    <RestoreObject />
                            </Tab>
                            <Tab eventKey="multipart-upload" title="分片上传">
                                    <MultipartUpload />
                            </Tab>
                            <Tab eventKey="delete" title="文件删除">
                                    <DeleteObjects />
                            </Tab>
                            <Tab eventKey="acl" title="获取文件权限信息">
                                    <GetObjectAcl />
                            </Tab>
                            <Tab eventKey="attributes" title="获取文件元数据">
                                    <GetObjectAttr />
                            </Tab>
                            <Tab eventKey="list" title="获取目录文件列表">
                                    <ListObjects />
                            </Tab>
                    </Tabs>
            </Container>
        );
}

export default App;
