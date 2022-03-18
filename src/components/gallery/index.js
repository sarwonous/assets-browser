import Item from './item';

const Gallery = ({
    files = [],
    loading,
    next,
    keyword,
    onCopyText,
    onDelete,
    allowDelete,
    allowUpload,
}) => {
    return (
        <div className="w-1/1">
            {loading && (
                <div className="flex flex-wrap justify-start">
                    {(Array.from(Array(18).keys())).map(i => (
                        <Item
                            key={i}
                            loading
                            />
                    ))}
                </div>
            )}
            {!loading && (
                <div className="flex flex-wrap justify-start">
                    {files.map((image, i) => {
                        if (!image || (image.url && image.url.indexOf("http") < 0))
                            return null;
                        return (
                            <Item
                                key={i}
                                image={image}
                                onCopyText={onCopyText}
                                onDelete={onDelete}
                                allowDelete={allowDelete}
                                i={i}
                                />
                        );
                    })}
                </div>
            )}
            {!loading && files.length < 1 && (
                <div className="text-gray-500">No assets found with keyword <code>{keyword}</code>, try another keyword</div>
            )}
        </div>
    );
}

export default Gallery;