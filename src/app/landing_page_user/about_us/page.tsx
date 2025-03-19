import Image from 'next/image';

export default function AboutUs() {
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">About Us</h1>
          <p className="mt-4 text-lg">Empowering Digital Transformation Through Trusted Applications</p>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2 text-black">Main Objectives</h2>
          <p className="text-gray-600 mb-6">
          Empowering Developers and Enhancing User Experience Through a Unified App Marketplace
              </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 shadow-md rounded">
              <h3 className="text-xl font-semibold text-black">Promote Digital Transformation</h3>
              <p className="mt-2 text-gray-600">
                Support the adoption of innovative technologies to streamline processes, improve efficiency, and foster
                transparency across government services.
              </p>
            </div>
            <div className="bg-white p-6 shadow-md rounded">
              <h3 className="text-xl font-semibold text-black">Ensure Security and Reliability</h3>
              <p className="mt-2 text-gray-600">
                Deliver trusted and verified applications that safeguard user data and maintain high standards of
                security.
              </p>
            </div>
            <div className="bg-white p-6 shadow-md rounded">
              <h3 className="text-xl font-semibold text-black">Foster Collaboration and Innovation</h3>
              <p className="mt-2 text-gray-600">
                Partner with government and non-government organizations to develop forward-thinking solutions that meet
                the evolving needs of users.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-8 bg-gray-100">
        <div className="container mx-10 grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
          <Image
            src="/country.png"
            alt="Vision"
            width={500}
            height={300}
            className="rounded shadow-md"
          />
          <div>
            <h3 className="text-xl font-bold text-black">Seamless Access to Trusted Government Services</h3>
            <p className="mt-2 text-gray-600">
            The Government App Store revolutionizes how you interact with public services by offering a centralized platform for secure and user-friendly applications. Whether you’re accessing essential documents, managing permits, or exploring community resources, our curated collection of apps ensures convenience and reliability. Join the movement towards digital governance and experience the future of streamlined public services today.
            </p>
          </div>
        </div>
      </section>


      {/* Statistics Section */}
      <section className="bg-blue-700 text-white py-16">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 text-center">
          <div>
            <h3 className="text-3xl font-bold">2+</h3>
            <p className="mt-2">Years</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">100+</h3>
            <p className="mt-2">Apps & Web Portal</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">40</h3>
            <p className="mt-2">Download Rate</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">20+</h3>
            <p className="mt-2">Industries Served</p>
          </div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-xl font-bold text-black">Our Mission</h3>
            <p className="mt-4 text-gray-600">
              To provide a centralized platform that offers secure and accessible government applications. We aim to
              simplify and enhance the user experience with reliable digital services.
            </p>
          </div>
          <Image
            src="/our_mission.png"
            alt="Mission"
            width={500}
            height={300}
            className="rounded shadow-md"
          />
          <Image
            src="/our_vission.png"
            alt="Vision"
            width={500}
            height={300}
            className="rounded shadow-md"
          />
          <div>
            <h3 className="text-xl font-bold text-black">Our Vision</h3>
            <p className="mt-4 text-gray-600">
              To become the leading hub for accessible, reliable, and cutting-edge government applications, driving
              digital transformation and empowering communities nationwide.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-blue-900 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Gov App Store. All rights reserved.</p>
        </div>
      </footer> */}
        <footer className="bg-blue-900  text-white py-5 px-10 ">
        <div className="flex flex-wrap justify-between items-center mb-6">
          {/* Logo Section */}
          <div className="flex flex-col items-start">
            {/* <img
                src="/logo_efdri.png"
                width={30}
                height={40}
                alt="Logo"
                className="h-12 mb-2"
              /> */}

            <p
            // className='text-white'
            
            style={{ fontSize: "12px", color: "white"}}>
              Copyright © {new Date().getFullYear()} App Store. All rights
              reserved.
            </p>
            <div className="flex justify-center space-x-4 mt-2 text-white">
              <a
                style={{ fontSize: "12px" }}
                href="#"
                className="hover:text-blue-600"
              >
                Facebook
              </a>
              <a
                style={{ fontSize: "12px" }}
                href="#"
                className="hover:text-blue-600"
              >
                Twitter
              </a>
              <a
                style={{ fontSize: "12px" }}
                href="#"
                className="hover:text-blue-600"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-3 gap-8 text-sm text-white">
            {/* Column 1 */}
            <div>
              <h4 className="font-bold mb-2">Developers</h4>
              <ul>
                <li>
                  <a href="/login" className="hover:underline">
                    Developer Console
                  </a>
                </li>
                <li>
                  <a href="/login" className="hover:underline">
                    Submit APK
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2 */}

            {/* Column 3 */}
            <div className="ml-20">
              <h4 className="font-bold mb-2 ">Company</h4>
              <ul>
                <li>
                  <a
                    href="/landing_page_user/contact_us"
                    className="hover:underline"
                  >
                  Contact Us

                  </a>
                </li>
                <li>
                  <a
                    href="/landing_page_user/about_us"             
                    className="hover:underline">
                    About Us
                    </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-4  text-white">
          <p style={{ fontSize: "12px" }}>
            Copyright © {new Date().getFullYear()} Gov App Ethiopia All rights
            reserved. | Privacy Policy | Copyright Policy | Terms | 
          </p>
        </div>
      </footer>
    </div>
  );
}
