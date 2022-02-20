export const loadBucket = async(name, cancel) => {
    try {
        const res = await fetch(`/api/path/${name}`, {
            signal: cancel.signal
        });
        const { files, next } = await res.json();
        return { files, next };
    } catch (error) {
        console.log(error);
        return { files: [], next: null, error: error.message };
    }
}