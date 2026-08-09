'use client'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" }
  }
}

export default function PrivacyPolicyClient() {
  return (
    <div className="pt-32 pb-20 bg-white overflow-hidden">
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Privacy Policy
          </h1>
          <motion.div
            className="w-24 h-1 bg-brand mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </motion.div>

        {/* Content */}
        <div className="prose prose-lg mx-auto text-gray-600 space-y-10" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>

          <motion.p variants={itemVariants} className="text-lg leading-relaxed text-center md:text-left">
            At <strong className="text-gray-900 font-bold">Diamond Design</strong>, we respect your privacy and are
            committed to protecting your personal information. This policy explains what information we collect and how we use it.
          </motion.p>

          <motion.div variants={itemVariants} className="bg-gray-50 p-8 rounded-2xl border-l-4 border-brand">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Information We Collect</h3>
            <p className="mb-4">We may collect basic information you provide directly to us, such as your name and email address when you contact us through our website.</p>
            <p>We also automatically collect certain information when you visit our site, including your browser type, device information, and pages viewed, through analytics tools like Google Analytics.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-gray-50 p-8 rounded-2xl border-l-4 border-brand">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Cookies</h3>
            <p>Our website uses cookies to improve your browsing experience and understand how visitors use our site. You can disable cookies through your browser settings at any time.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-gray-50 p-8 rounded-2xl border-l-4 border-brand">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">How We Use Your Information</h3>
            <p>We use the information we collect to operate and improve our website, respond to your inquiries, and understand how visitors interact with our content.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-gray-50 p-8 rounded-2xl border-l-4 border-brand">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Third-Party Services</h3>
            <p>We may use third-party services such as Google Analytics and Pinterest to help us understand site traffic and improve our marketing. These services may collect information sent by your browser as part of their own analytics tools.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-gray-50 p-8 rounded-2xl border-l-4 border-brand">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Sharing</h3>
            <p>We do not sell your personal information to third parties.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-gray-50 p-8 rounded-2xl border-l-4 border-brand">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Choices</h3>
            <p>You may contact us at any time if you have questions about your information or wish to have it removed from our records.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-gray-50 p-8 rounded-2xl border-l-4 border-brand">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Changes to This Policy</h3>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page.</p>
          </motion.div>

          <motion.p variants={itemVariants} className="text-center text-gray-500 pt-6">
            If you have any questions about this Privacy Policy, please contact us through our{' '}
            <a href="/contact" className="text-brand font-medium hover:underline">Contact Us</a> page. We are happy to help.
          </motion.p>

        </div>
      </motion.div>
    </div>
  )
}
