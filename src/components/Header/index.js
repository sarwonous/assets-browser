const Header = ({ site_title, site_description, ...props }) => {
    return (
        <div className="bg-slate-800 text-white px-3">
            <div className="container mx-auto">
                <div className="py-5">
                    <h1 className="text-2xl sm:text-4xl py-3 text-center sm:text-left">{site_title}</h1>
                    <p className=" text-center sm:text-left">{site_description}</p>
                </div>
            </div>
        </div>
    );
};
export default Header;