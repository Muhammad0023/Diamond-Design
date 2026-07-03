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

export default function ReturnExchangeClient() {
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
            Return & Exchange Policy
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
            Thank you for shopping with <strong className="text-gray-900 font-bold">Diamond Design</strong>. We want every customer
            to be satisfied with their order. Please read our policy carefully before making a purchase.
          </motion.p>

          <motion.div variants={itemVariants} className="bg-gray-50 p-8 rounded-2xl border-l-4 border-brand">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Returns</h3>
            <p className="mb-4">We accept returns only in the following cases:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>The item is defective or damaged upon arrival</li>
              <li>You received the wrong item</li>
            </ul>
            <p className="mb-4">To request a return, please contact us within 14 days of receiving your order.</p>
            <p className="mb-2">To be eligible for a return:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Items must be unused and unworn</li>
              <li>Items must be in their original packaging and condition</li>
              <li>Proof of purchase is required</li>
            </ul>
            <p>We do not accept returns for change of mind or incorrect size selection.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-gray-50 p-8 rounded-2xl border-l-4 border-brand">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Return Shipping</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Customers are responsible for return shipping costs</li>
              <li>Shipping costs from the original order are non-refundable</li>
              <li>We recommend using a trackable shipping service for returns</li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-gray-50 p-8 rounded-2xl border-l-4 border-brand">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Exchanges</h3>
            <p>We currently do not offer exchanges. If you need a different size or item, please place a new order.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-gray-50 p-8 rounded-2xl border-l-4 border-brand">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Refunds</h3>
            <p className="mb-4">Once we receive and inspect your returned item, we will notify you about the approval or rejection of your refund.</p>
            <p className="mb-2">If approved:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Refunds will be processed to your original payment method</li>
              <li>Processing time may take 5–10 business days, depending on your bank or payment provider</li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-gray-50 p-8 rounded-2xl border-l-4 border-brand">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Issues</h3>
            <p>If your order arrives damaged, incorrect, or missing items, please contact us immediately so we can resolve the issue.</p>
          </motion.div>

          <motion.p variants={itemVariants} className="text-center text-gray-500 pt-6">
            If you have any questions about returns or your order, please contact us through our{' '}
            <a href="/contact" className="text-brand font-medium hover:underline">Contact Us</a> page. We are happy to help.
          </motion.p>

        </div>
      </motion.div>
    </div>
  )
}
