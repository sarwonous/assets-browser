import { useEffect, useState } from "react";
import styled from "styled-components";


const Gallery = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
`;

const Thumb = styled.div`
    width: 10%;
    // padding: 0.01rem;
    // height: 1rem;
    padding: 5px;
    cursor: pointer;
    input {
        position: absolute;
        top:-30px;
        left: 0;
    }
    > div {
        border-radius: 4px;
        border: 1px solid #9bb3c7;
        background-color: #d4ebff;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    img {
        width: 100%;
        height: 100%;
    }
`;

const Image = styled.div`
    &&& {
        width: 100%;
        @media (min-width: 768px) {
            max-width: 500px;
            max-height: 500px;
        }
        img {
            width: 100%;
        }
    }
`;

const Title = styled.h1`
    padding: 0 10px;
`;

function HomePage({ data = [], start_path, ...props }) {
    const [files, setFiles] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    useEffect(() => {
        const cancel = new window.AbortController();
        const init = async () => {
            try {
                const res = await fetch(`/api/path/${start_path}`, {
                    signal: cancel.signal
                });
                const files = await res.json();
                setFiles(files.map((f, i) => ({ ...f, i })));
            } catch (error) {
            
            }
        };
        init();

        return () => {
            // second
            cancel.abort();
        }
    }, [])
    const t = Array.from(Array(50).keys());
    console.log(t);

    const copyText = (name) => {
        const el = document.getElementById(name);
        console.log('name', name);
        el.style = 'position: relative;';
        el.focus();
        el.select();
        el.setSelectionRange(0, 99999999);
        navigator.clipboard.writeText(el.value);
        el.blur()
        el.style = 'position: absolute; top:-30px; left: 0;';
        // alert('Copied to clipboard');
    }
    return (
        <div className="container mx-auto">
            <Title>Okadoc Images</Title>
            <Image>
                {selectedImage && (
                    <img src={selectedImage.url} alt={selectedImage.name} />
                )}
            </Image>
            <Gallery>
                {t.map(key => (
                    <>
                        {files.map((image, i) => {
                            if (!image || (image.url && image.url.indexOf("http") < 0))
                                return null;
                            return (
                                <Thumb
                                    key={i}
                                    onClick={() => {
                                        setSelectedImage(image);
                                        // window.prompt("", image.url)
                                        copyText(`name-${image.i}-${key}`);
                                    }}
                                    >
                                    <div>
                                        <img src={image.url} alt={image.name} />
                                        <input type="input" id={`name-${image.i}-${key}`} value={`${image.name}-${key}`} />
                                    </div>
                                </Thumb>
                            );
                        })}
                    </>
                ))}
            </Gallery>
        </div>
    );
}

export async function getStaticProps() {
  return {
    props: {
      start_path: process.env.START_PATH,
    }, // will be passed to the page component as props
    revalidate: 1
  };
}

export default HomePage;
