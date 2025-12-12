"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const ContactInfo = () => {
  const [siteSettings, setSiteSettings] = useState<{
    contactEmail?: string;
    contactPhone?: string;
    contactAddress?: string;
  }>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/layoutdata');
        if (response.ok) {
          const data = await response.json();
          setSiteSettings({
            contactEmail: data.contactEmail || null,
            contactPhone: data.contactPhone || null,
            contactAddress: data.contactAddress || null,
          });
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };
    fetchSettings();
  }, []);

  // Format phone number for WhatsApp (remove spaces, dashes, parentheses)
  const formatPhoneForWhatsApp = (phone: string) => {
    if (!phone) return '';
    return phone.replace(/[\s\-\(\)]/g, '');
  };

  const phoneNumber = siteSettings.contactPhone || '';
  const whatsappNumber = formatPhoneForWhatsApp(phoneNumber);
  const email = siteSettings.contactEmail || 'info@propertypro.com';
  const address = siteSettings.contactAddress || '221b Baker St, London NW1 6XE, United Kingdom';

  return (
    <>
      <section className="relative overflow-hidden !py-0 pt-1 pb-0 px-4">
        {/* Keep Imigongo visible by using a translucent overlay instead of a solid background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#F4EEDF]/80 dark:bg-darkmode/80 pointer-events-none"
        />
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {/* Email */}
            <div className="flex sm:flex-row flex-col items-start sm:gap-8 gap-4">
              <Link
                href={`mailto:${email}`}
                aria-label="Email Hillside Prime"
                className="bg-primary/20 w-3.75 h-3.75 flex items-center justify-center rounded-full hover:bg-primary/30 transition-colors cursor-pointer"
              >
                <i className="bg-[url('/images/contact-page/email.svg')] bg-no-repeat bg-contain w-8 h-8 inline-block"></i>
              </Link>
              <div className="flex md:flex-col sm:flex-row flex-col md:items-start sm:items-center items-start h-full justify-between">
                <div>
                  <span className="text-midnight_text dark:text-white text-xl font-bold">
                    Email Us
                  </span>
                  <p className="text-midnight_text/70 font-normal text-xl max-w-80 pt-3 pb-7 dark:text-gray">
                    Reach us at{' '}
                    <Link 
                      href={`mailto:${email}`}
                      className="text-primary hover:underline"
                    >
                      {email}
                    </Link>
                    {' '}we respond promptly.
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="flex sm:flex-row flex-col items-start sm:gap-8 gap-4">
              <div className="bg-primary/20 w-3.75 h-3.75 flex items-center justify-center rounded-full">
                <i className="bg-[url('/images/contact-page/Career.svg')] bg-no-repeat bg-contain w-9 h-9 inline-block"></i>
              </div>
              <div className="flex md:flex-col sm:flex-row flex-col md:items-start sm:items-center items-start h-full justify-between">
                <div>
                  <span className="text-midnight_text dark:text-white text-xl font-bold">
                    Address
                  </span>
                  <p className="text-midnight_text/70 font-normal text-xl max-w-80 pt-3 pb-7 dark:text-gray">
                    {address}
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Call */}
            {phoneNumber && (
              <div className="flex sm:flex-row flex-col items-start sm:gap-8 gap-4">
                <Link
                  href={`tel:${phoneNumber}`}
                  aria-label="Call Hillside Prime"
                  className="bg-primary/20 w-3.75 h-3.75 flex items-center justify-center rounded-full hover:bg-primary/30 transition-colors cursor-pointer"
                >
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </Link>
                <div className="flex md:flex-col sm:flex-row flex-col md:items-start sm:items-center items-start h-full justify-between">
                  <div>
                    <span className="text-midnight_text dark:text-white text-xl font-bold">
                      Call Us
                    </span>
                    <p className="text-midnight_text/70 font-normal text-xl max-w-80 pt-3 pb-7 dark:text-gray">
                      <Link 
                        href={`tel:${phoneNumber}`}
                        className="text-primary hover:underline font-semibold"
                      >
                        {phoneNumber}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* WhatsApp */}
            {whatsappNumber && (
              <div className="flex sm:flex-row flex-col items-start sm:gap-8 gap-4">
                <Link
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Hillside Prime"
                  className="bg-primary/20 w-3.75 h-3.75 flex items-center justify-center rounded-full hover:bg-primary/30 transition-colors cursor-pointer"
                >
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </Link>
                <div className="flex md:flex-col sm:flex-row flex-col md:items-start sm:items-center items-start h-full justify-between">
                  <div>
                    <span className="text-midnight_text dark:text-white text-xl font-bold">
                      WhatsApp
                    </span>
                    <p className="text-midnight_text/70 font-normal text-xl max-w-80 pt-3 pb-7 dark:text-gray">
                      <Link 
                        href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-semibold"
                      >
                        {phoneNumber}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="border-b border-solid border-border dark:border-dark_border"></div>
      </section>
    </>
  );
};

export default ContactInfo;
