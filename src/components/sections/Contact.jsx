import { useState, useEffect } from 'react';
import { Send, CheckCircle2, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { addDemoRequest, getProjects } from '../../data/store';
import Button from '../ui/Button';

const EMPTY_FORM = {
  fullName: '',
  companyName: '',
  email: '',
  phone: '',
  interestedIn: '',
  message: '',
};

const CONTACT_INFO = [
  { icon: Mail, label: 'Email', value: 'mebratubereket94@gmail.com', href: 'mailto:mebratubereket94@gmail.com' },
  { icon: Phone, label: 'Phone', value: '+251 944 250 799', href: 'tel:+251944250799' },
  { icon: MapPin, label: 'Address', value: 'Addis Ababa, Ethiopia', href: null },
  { icon: Clock, label: 'Hours', value: 'Mon–Fri, 9am–6pm EAT', href: null },
];

export default function Contact({ preselectedSystem = '' }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, interestedIn: preselectedSystem });
  const [projects, setProjects] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  useEffect(() => {
    if (preselectedSystem) {
      setForm((f) => ({ ...f, interestedIn: preselectedSystem }));
    }
  }, [preselectedSystem]);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.companyName.trim()) e.companyName = 'Company name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Valid email is required';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      addDemoRequest(form);
      setSubmitted(true);
      setLoading(false);
      setForm(EMPTY_FORM);
    }, 800);
  };

  const inputBase =
    'w-full px-4 py-3 rounded-xl text-white placeholder-[#555] text-sm focus:outline-none transition-colors';
  const inputStyle = (field) => ({
    background: '#0a0a0a',
    border: `1px solid ${errors[field] ? 'rgba(239,68,68,0.6)' : 'rgba(201,168,76,0.2)'}`,
  });
  const inputFocusStyle = { borderColor: '#C9A84C', boxShadow: '0 0 0 1px rgba(201,168,76,0.2)' };

  const InputField = ({ field, type = 'text', placeholder, label, required, children }) => (
    <div>
      <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children || (
        <input
          type={type}
          name={field}
          value={form[field]}
          onChange={handleChange}
          placeholder={placeholder}
          className={inputBase}
          style={inputStyle(field)}
          onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.target.style, inputStyle(field))}
        />
      )}
      {errors[field] && <p className="mt-1 text-xs text-red-400">{errors[field]}</p>}
    </div>
  );

  return (
    <section id="contact" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.25)',
              color: '#C9A84C',
            }}
          >
            Get In Touch
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Request a Demo
          </h2>
          <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto">
            Ready to see our systems in action? Fill out the form and our team will reach out within one business day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            <div
              className="p-8 rounded-2xl"
              style={{ background: '#111111', border: '1px solid rgba(201,168,76,0.15)' }}
            >
              <h3 className="text-lg font-bold text-white mb-6">Contact Information</h3>
              <div className="space-y-5">
                {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: 'rgba(201,168,76,0.1)',
                        border: '1px solid rgba(201,168,76,0.2)',
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color: '#C9A84C' }} />
                    </div>
                    <div>
                      <div className="text-xs text-[#555] mb-0.5">{label}</div>
                      {href ? (
                        <a
                          href={href}
                          className="text-sm text-[#A0A0A0] transition-colors"
                          onMouseEnter={(e) => (e.target.style.color = '#C9A84C')}
                          onMouseLeave={(e) => (e.target.style.color = '#A0A0A0')}
                        >
                          {value}
                        </a>
                      ) : (
                        <span className="text-sm text-[#A0A0A0]">{value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="p-6 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.04))',
                border: '1px solid rgba(201,168,76,0.2)',
              }}
            >
              <p className="text-sm leading-relaxed" style={{ color: '#C9A84C' }}>
                <strong className="text-white">All inquiries</strong> receive personal attention from our founder. We will prepare a tailored demo based on your specific business needs.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div
                className="h-full flex flex-col items-center justify-center text-center p-12 rounded-2xl"
                style={{ background: '#111111', border: '1px solid rgba(201,168,76,0.3)' }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                  style={{ background: 'rgba(201,168,76,0.1)' }}
                >
                  <CheckCircle2 className="w-8 h-8" style={{ color: '#C9A84C' }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Request Received!</h3>
                <p className="text-[#A0A0A0] mb-6">
                  Thank you for your interest. Our team will contact you within one business day to schedule your personalized demo.
                </p>
                <Button variant="secondary" onClick={() => setSubmitted(false)}>
                  Submit Another Request
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="p-8 rounded-2xl space-y-5"
                style={{ background: '#111111', border: '1px solid rgba(201,168,76,0.15)' }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField field="fullName" label="Full Name" placeholder="Bereket Mebratu" required />
                  <InputField field="companyName" label="Company Name" placeholder="Acme Pharmacy" required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField field="email" type="email" label="Email Address" placeholder="you@company.com" required />
                  <InputField field="phone" type="tel" label="Phone Number" placeholder="+251 9XX XXX XXX" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">
                    Interested In
                  </label>
                  <select
                    name="interestedIn"
                    value={form.interestedIn}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none transition-colors appearance-none"
                    style={{
                      background: '#0a0a0a',
                      border: '1px solid rgba(201,168,76,0.2)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#C9A84C')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
                  >
                    <option value="">Select a system...</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title}
                      </option>
                    ))}
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Custom Development">Custom Development</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your business and what you're looking to achieve..."
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-[#555] text-sm focus:outline-none transition-colors resize-none"
                    style={{
                      background: '#0a0a0a',
                      border: `1px solid ${errors.message ? 'rgba(239,68,68,0.6)' : 'rgba(201,168,76,0.2)'}`,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#C9A84C';
                      e.target.style.boxShadow = '0 0 0 1px rgba(201,168,76,0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.message ? 'rgba(239,68,68,0.6)' : 'rgba(201,168,76,0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Request
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
