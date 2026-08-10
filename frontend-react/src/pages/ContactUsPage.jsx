import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Clock3, Send } from "lucide-react";

import { toast } from "react-toastify";

import {
  fetchAllSubjects,
  saveContactUsDetails,
} from "../api/service/contactUsService";

export default function ContactUsPage() {
  const [subjects, setSubjects] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    orderId: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  // Fetch Subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetchAllSubjects();

        setSubjects(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSubjects();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Frontend Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must contain 10 digits";
    }

    if (!formData.subject) {
      newErrors.subject = "Please select subject";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    return newErrors;
  };

  // Submit Form
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      return;
    }

    try {
      await saveContactUsDetails(formData);

      toast.success("Message sent successfully");

      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        orderId: "",
        subject: "",
        message: "",
      });

      setErrors({});
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-50 text-orange-600 text-sm font-semibold mb-4">
            Customer Support
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
            We’re Here To Help
          </h1>

          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
            Have questions about your order, payments, refunds or delivery? Our
            support team is always ready to assist you.
          </p>
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Support Card */}
          <div
            className="
          lg:col-span-2
          bg-[#ff5200]
          rounded-3xl
          p-7
          text-white
          shadow-lg
          relative
          overflow-hidden
          "
          >
            <div
              className="
          absolute -top-10 -right-10
          w-40 h-40
          bg-white/10
          rounded-full
          "
            ></div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold">Get In Touch</h2>

              <p className="mt-3 text-orange-100 text-sm leading-relaxed">
                Our customer support team is available every day to help you
                with orders, payments, refunds and delivery issues.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center">
                    <Mail size={21} />
                  </div>

                  <div>
                    <p className="text-xs text-orange-100">Email Support</p>

                    <h3 className="font-semibold">support@foodexpress.com</h3>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center">
                    <Phone size={21} />
                  </div>

                  <div>
                    <p className="text-xs text-orange-100">Customer Care</p>

                    <h3 className="font-semibold">+91 9876543210</h3>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center">
                    <MapPin size={21} />
                  </div>

                  <div>
                    <p className="text-xs text-orange-100">Location</p>

                    <h3 className="font-semibold">Bhubaneswar, Odisha</h3>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center">
                    <Clock3 size={21} />
                  </div>

                  <div>
                    <p className="text-xs text-orange-100">Working Hours</p>

                    <h3 className="font-semibold">Mon - Sun : 9 AM - 11 PM</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div
            className="
          lg:col-span-3
          bg-white
          rounded-3xl
          border
          border-gray-100
          shadow-sm
          p-7
          "
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Send a Message
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                Fill the details below and our team will contact you shortly.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleFormSubmit}>
              {/* Name + Email */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="
                  mt-2
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  py-3
                  outline-none
                  transition
                  focus:bg-white
                  focus:ring-2
                  focus:ring-orange-400
                  "
                  />

                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="
                  mt-2
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  py-3
                  outline-none
                  transition
                  focus:bg-white
                  focus:ring-2
                  focus:ring-orange-400
                  "
                  />

                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Phone + Subject */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="
                  mt-2
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  py-3
                  outline-none
                  focus:bg-white
                  focus:ring-2
                  focus:ring-orange-400
                  "
                  />

                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Subject
                  </label>

                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="
                  mt-2
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  py-3
                  outline-none
                  focus:bg-white
                  focus:ring-2
                  focus:ring-orange-400
                  "
                  >
                    <option value="">Select Subject</option>

                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>

                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.subject}
                    </p>
                  )}
                </div>
              </div>

              {/* Order ID */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Order ID (Optional)
                </label>

                <input
                  type="text"
                  name="orderId"
                  value={formData.orderId}
                  onChange={handleChange}
                  placeholder="FD123456"
                  className="
                mt-2
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-4
                py-3
                outline-none
                focus:bg-white
                focus:ring-2
                focus:ring-orange-400
                "
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Message
                </label>

                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="
                mt-2
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-4
                py-3
                outline-none
                resize-none
                focus:bg-white
                focus:ring-2
                focus:ring-orange-400
                "
                />

                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="
              flex
              items-center
              justify-center
              gap-2
              bg-orange-500
              hover:bg-orange-600
              text-white
              font-semibold
              px-7
              py-3
              rounded-xl
              transition
              shadow-sm
              "
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
