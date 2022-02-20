import {
    TrashIcon
} from "@heroicons/react/outline";
import to from 'await-to-js';
import { createRef, useState } from "react";
import Axios from 'axios';
import axios from "axios";

const Upload = ({ name, ...props }) => {
    const [uploading, setUploading] = useState(false);
    const [x, setX] = useState(0);
    const [files, setFiles] = useState([]);

    const onDrop = (acceptedFiles) => {

    }

    const onDelete = (id) => (e) => {
        setFiles(files.filter(f => f.id !== id));
    }

    const onChange = (f) => {
        const file = f.target.files[0];
        if (!file) return;
        const r = new FileReader();
        r.readAsArrayBuffer(file);
        r.onload = (e) => {
            file.id = x;
            file.data = [r.result];
            file.ref = createRef();
            files.push(file)
            setFiles(files);
            setX(x + 1);
        }
    }

    const onUpload = () => {
        setUploading(true);
        // upload using axios
        // get upload url
        Promise.all(files.map(async file => {
            const [err, resp] = await to(fetch('/api/upload', {
                method: "POST",
                headers: {
                'Content-Type': 'application/json'
                },
                headers: {
                    'x-file-id': `${file.name}-${file.id}`,
                    'x-bucket-name': name,
                    'x-file-name': file.name,
                }
            }));
            console.log('get url error', err, resp);
            if (err) {
                return [false, err];
            }
            const [errJson, { url }] = await to(resp.json());
            console.log('get url json', errJson, url);
            if (errJson) {
                return [false, errJson];
            }
            if (url) {
                const [errUpload, uploadedFile] = await to(axios.put(url, new Blob(file.data, { type: file.type }), {
                    headers: {
                        'Content-Type': file.type
                    },
                    onUploadProgress: (e) => {
                        console.log(file.ref);
                        console.log('upload progress', file.name, e.loaded, e.total);
                    }
                }));
                console.log('upload error', errUpload, uploadedFile);
                if (errUpload) {
                    return [false, errUpload];
                }
                await to(fetch('/api/public', {
                    method: "POST",
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    headers: {
                        'x-file-id': `${file.name}-${file.id}`,
                        'x-bucket-name': name,
                        'x-file-name': file.name,
                    }
                }));
                setFiles(files.filter(f => f.id !== file.id));
                return [true, uploadedFile];
            }
            return [false, new Error('No URL')];
        })).finally(() => {
            setUploading(false);
        });
    }

    return (
        <div className="flex flex-wrap justify-center flex-col w-1/2 mx-auto rounded shadow p-12">
            <div className="p-2 mb-6">
                <div>Upload to <span className="bg-slate-900 text-white rounded px-2 py-1">{name}</span></div>
            </div>
            {files.length > 0 && (
                <div className="flex flex-col border rounded p-2 mb-10">
                    {files.map(f => (
                        <div key={f} ref={f.ref}>
                            <div className="flex justify-between p-2 hover:bg-slate-100 hover:p-2">
                                <div className="text-ellipsis ">{f.name}</div>
                                <TrashIcon width={24} onClick={onDelete(f.id)} />
                            </div>
                            <div className="bg-green-400 w-1/2 rounded h-1 mx-2" />
                        </div>
                    ))}
                </div>
            )}
            <div className="flex flex-col border rounded p-2 mb-10 hidden">
                <div className="flex justify-between items-center">

                </div>
                <div className="flex justify-center items-center h-24">
                    Drop files here or click to upload
                </div>
            </div>
            <div className="flex py-2">
                <div className="relative flex-none items-center">
                    <button disabled={uploading} className="border rounded bg-slate-800 disabled:bg-slate-500 text-white py-2 px-5  cursor-pointer disabled:cursor-progress">Add file</button>
                    <input type="file" disabled={uploading} className="border-b w-full opacity-0 absolute left-0 top-0 py-2 cursor-pointer disabled:cursor-progress" onChange={onChange} />
                </div>
                <div>
                    <input type="submit" disabled={uploading} value="Upload" onClick={onUpload} className="border rounded bg-slate-800 disabled:bg-slate-500 text-white py-2  px-5 cursor-pointer disabled:cursor-progress" />
                </div>
            </div>
        </div>
    );
};

export default Upload;