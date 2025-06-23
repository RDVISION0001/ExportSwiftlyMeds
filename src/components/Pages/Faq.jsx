import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "Do you sell brand name pills?",
            answer: "Yes, we sell both Brand and Generic pills."
        },
        {
            question: "What does the term 'generic' mean?",
            answer: "Generic drugs are produced and distributed without patent protection. A generic contains the same active ingredients as the brand pills and is identified by its chemical name rather than its brand name. Generic Drugs are manufactured by the certified producer but not by the original drug's producer. Generic drugs can be issued when the brand-name equivalent's patent expires. Upon the original medicine's patent expiration any pharmaceutical company can obtain a right on its production and purchase a chemical formula."
        },
        {
            question: "Why do generic medicines cost less than brand ones?",
            answer: "Generic medicines cost less because their manufacturers don't have to repeat the expensive clinical trials that brand-name drugs require. They also don't have the same marketing costs as brand-name drugs."
        },
        {
            question: "What is the quality of generic drugs?",
            answer: "Generic drugs must meet the same quality standards as brand-name drugs. They contain the same active ingredients and work in the same way in the body."
        },
        {
            question: "Are the generic pills sold here FDA approved?",
            answer: "Yes, all generic medications we sell are FDA-approved and meet strict quality standards."
        },
        {
            question: "What is the difference between Soft and Regular medicine?",
            answer: "Soft tablets dissolve faster in the stomach and may work more quickly than regular tablets. They're often preferred by people who have difficulty swallowing pills."
        },
        {
            question: "Is there a difference between 50mg and 100mg ED tabs? What should be my starting dosage?",
            answer: "The difference is in the strength of the active ingredient. We recommend starting with the lower 50mg dose and adjusting as needed under medical supervision."
        },
        {
            question: "Do you require a prescription before purchasing on your site?",
            answer: "No, we operate as a consultation-free service, but we always recommend consulting with a healthcare provider before starting any medication."
        },
        {
            question: "What shipping rates do you have?",
            answer: "We offer several shipping options: AirMail ($9.95, 2-3 weeks), EMS ($29.95, 3-8 business days). Free shipping is available for orders over $200 (AirMail) or $300 (EMS)."
        },
        {
            question: "What if the order isn't received during the delivery time?",
            answer: "If your order hasn't arrived within the estimated delivery window, please contact our customer support. We'll track your package and if it's lost in transit, we'll either reship your order or issue a refund according to our delivery guarantee policy."
        },
        {
            question: "How can I order from you?",
            answer: "Ordering is simple: 1) Select your products, 2) Proceed to checkout, 3) Enter shipping details, 4) Choose payment method, and 5) Confirm your order. You'll receive an order confirmation email with all details."
        },
        {
            question: "When will my credit card be charged?",
            answer: "Your credit card will be charged immediately when you place your order. The charge will appear on your statement under our company name or our payment processor's name."
        },
        {
            question: "Can I cancel the order and can I get my card credited?",
            answer: "You can cancel your order within 1 hour of placement for a full refund. After that but before shipment, you may request cancellation with a possible restocking fee. Once shipped, you'll need to follow our return process. Refunds are issued to your original payment method within 5-7 business days."
        },
        {
            question: "How can I check the status of my order?",
            answer: "You can check your order status by logging into your account or using the tracking link in your shipping confirmation email. For AirMail orders without tracking, please allow the full delivery window before inquiring."
        },
        {
            question: "What payments do you accept?",
            answer: "We accept: Visa, MasterCard, American Express, Bitcoin and other cryptocurrencies, bank transfers, and select e-wallets. All payments are processed through secure, encrypted channels."
        },
        {
            question: "Do you have a money back guarantee?",
            answer: "Yes, we offer a 30-day money back guarantee on unopened products. If you're unsatisfied with your purchase for any reason, you may return the unused portion for a full refund (minus shipping costs). Some restrictions apply - please see our full Returns Policy for details."
        },
        {
            question: "What if I didn't find an answer to my question here?",
            answer: "Please contact our 24/7 customer support team via live chat or email at support@yourpharmacy.com. We typically respond within 1 hour during business hours and within 4 hours at other times."
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">FREQUENTLY ASKED QUESTIONS</h1>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="border-b border-gray-200 pb-4"
                    >
                        <button
                            className="flex justify-between items-center w-full text-left font-medium text-lg py-3 focus:outline-none"
                            onClick={() => toggleFAQ(index)}
                            aria-expanded={activeIndex === index}
                            aria-controls={`faq-${index}`}
                        >
                            <span className="text-blue-600 hover:text-blue-800 cursor-pointer">{faq.question}</span>
                            {activeIndex === index ? (
                                <FiChevronUp className="text-gray-500" />
                            ) : (
                                <FiChevronDown className="text-gray-500" />
                            )}
                        </button>

                        <div
                            id={`faq-${index}`}
                            className={`overflow-hidden transition-all duration-300 ${activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <div className="pt-2 pb-4 text-gray-700">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;