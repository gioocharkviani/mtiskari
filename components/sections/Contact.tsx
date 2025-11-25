"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef, useState } from "react";

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <section
      ref={ref}
      className="w-full py-20 px-5 flex justify-center relative"
      id="contact"
    >
      <div className="bg3 bg-fixed! bg-bottom-left absolute opacity-[0.03] inset-0 bg-cover -z-10"></div>

      <div className="max-w-[1500px] w-full">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            Get In Touch
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Ready to experience Mtiskari? Contact us for bookings and inquiries
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={cardVariants}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Send us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="Your name"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="+995 XXX XX XX XX"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Tell us about your inquiry or booking request..."
                />
              </motion.div>

              <motion.button
                type="submit"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#cdefcd] w-full text-[#000000] p-3 rounded-lg font-semibold hover:bg-[#b8e0b8] transition-colors duration-300"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            {/* Contact Information */}
            <motion.div
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={cardVariants}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                Contact Information
              </h3>

              <div className="space-y-4">
                <motion.div
                  variants={itemVariants}
                  className="flex items-start space-x-4"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-green-600 font-bold">📍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Address</h4>
                    <p className="text-gray-600">
                      Mtiskari Cottage, Utsera
                      <br />
                      Racha Region, Georgia
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-start space-x-4"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-blue-600 font-bold">📞</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Phone</h4>
                    <p className="text-gray-600">+995 555 12 34 56</p>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-start space-x-4"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-purple-600 font-bold">✉️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Email</h4>
                    <p className="text-gray-600">info@mtiskari.com</p>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-start space-x-4"
                >
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-orange-600 font-bold">🕒</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Availability
                    </h4>
                    <p className="text-gray-600">
                      24/7 for bookings and inquiries
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Google Map */}
            <motion.div
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={cardVariants}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                Find Us
              </h3>

              <div className="rounded-xl overflow-hidden h-64 bg-gray-200">
                {/* Google Maps Embed */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23818.112246258!2d43.367496!3d42.407566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDI0JzI3LjIiTiA0M8KwMjInMDMuMCJF!5e0!3m2!1sen!2sge!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mtiskari Cottage Location"
                  className="rounded-lg"
                ></iframe>
              </div>

              <motion.div variants={itemVariants} className="mt-4 text-center">
                <p className="text-gray-600">
                  Located in the beautiful Racha region, surrounded by mountains
                  and nature
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mt-12"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-linear-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Ready for Your Mountain Getaway?
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
              Contact us today to book your stay at Mtiskari Cottage. Whether
              youre planning a romantic escape, family vacation, or solo
              adventure in nature, were here to help you create unforgettable
              memories in the heart of Racha.
            </p>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 15px 30px rgba(4, 31, 6, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-linear-to-r from-green-600 via-green-700 to-green-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-lg relative overflow-hidden group"
            >
              <span className="relative z-10">Book Now</span>
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                initial={false}
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
