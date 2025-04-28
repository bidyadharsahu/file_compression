import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-violet-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About SecureZip</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            The fastest and most secure way to compress and store your files.
          </p>
        </div>
      </section>
      
      {/* About the Developer */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">About the Developer</h2>
          
          <div className="flex flex-col md:flex-row items-center max-w-3xl mx-auto">
            {/* Photo */}
            <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200 shadow-xl mb-6 md:mb-0 md:mr-8">
              <img 
                src="https://avatars.githubusercontent.com/u/131295002?v=4" 
                alt="Developer" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Description */}
            <div>
              <h3 className="text-xl font-bold">BIDYADHAR SAHU</h3>
              <p className="text-blue-600 mb-2">Cloud Solution Developer</p>
              <p className="text-gray-600">
                Expert in algorithms and cloud infrastructure, with a strong background in designing scalable platforms and working with blockchain technologies.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-violet-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Start Using SecureZip Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Compress, store, and share your files securely with our advanced platform.
          </p>
          <Link to="/register">
            <Button className="text-lg bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 h-auto font-bold">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
