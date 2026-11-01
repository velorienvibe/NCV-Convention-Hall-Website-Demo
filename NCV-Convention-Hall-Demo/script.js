'use strict';

// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    });
  });

  document.addEventListener('click', (event) => {
    if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    }
  });
}

// Automatic footer year
const yearElement = document.getElementById('year');
if (yearElement) yearElement.textContent = new Date().getFullYear();

// Gallery lightbox with keyboard and focus support
const lightbox = document.querySelector('.lightbox');
if (lightbox) {
  const lightboxImage = lightbox.querySelector('img');
  const closeButton = lightbox.querySelector('.lightbox-close');
  let previousFocus = null;

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    if (previousFocus) previousFocus.focus();
  };

  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      const galleryImage = item.querySelector('img');
      const source = galleryImage?.currentSrc || galleryImage?.src || item.dataset.full;
      if (!source) return;
      previousFocus = item;
      lightboxImage.src = source;
      lightboxImage.alt = item.querySelector('img')?.alt || 'NCV Convention Hall photograph';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      closeButton?.focus();
    });
  });

  closeButton?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });
}

// Enquiry form: builds a WhatsApp message; no data is stored by this static demo.
const enquiryForm = document.getElementById('enquiry-form');
if (enquiryForm) {
  const errorElement = document.getElementById('form-error');
  enquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (errorElement) errorElement.textContent = '';

    const formData = new FormData(enquiryForm);
    const getValue = (name) => String(formData.get(name) || '').trim();
    const name = getValue('name');
    const phone = getValue('phone');
    const occasion = getValue('event');

    if (!name || !phone || !occasion) {
      if (errorElement) errorElement.textContent = 'Please enter your name, phone number and occasion.';
      return;
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      if (errorElement) errorElement.textContent = 'Please enter a valid phone number.';
      return;
    }

    const message = [
      'Hello NCV Convention Hall, I would like to enquire about an event.',
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Occasion: ${occasion}`,
      `Preferred date: ${getValue('date') || 'Not decided'}`,
      `Expected guests: ${getValue('guests') || 'Not decided'}`,
      `Preferred contact time: ${getValue('time') || 'Any time'}`,
      `Additional details: ${getValue('message') || 'None'}`
    ].join('\n');

    const whatsappNumber = '919494789987';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    const whatsappLink = document.createElement('a');
    whatsappLink.href = whatsappUrl;
    whatsappLink.target = '_blank';
    whatsappLink.rel = 'noopener noreferrer';
    whatsappLink.hidden = true;
    document.body.appendChild(whatsappLink);
    whatsappLink.click();
    whatsappLink.remove();
  });
}
