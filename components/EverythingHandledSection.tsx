"use client"

import { motion } from "framer-motion"
import { FaSimCard, FaBed, FaSchool, FaPassport } from "react-icons/fa"

const items = [
  {
    icon: <FaSimCard className="text-accent w-8 h-8" />,
    title: "SIM Card",
    desc: "Get connected as soon as you land. We provide your Turkish SIM card."
  },
  {
    icon: <FaBed className="text-primary w-8 h-8" />,
    title: "Accommodation",
    desc: "Your place to stay is ready. We arrange your student housing or dorm."
  },
  {
    icon: <FaSchool className="text-tertiary w-8 h-8" />,
    title: "School Registration",
    desc: "We handle all university/school paperwork and enrollment for you."
  },
  {
    icon: <FaPassport className="text-success w-8 h-8" />,
    title: "Paperwork",
    desc: "Residence permit, health insurance, and all documents managed by us."
  }
]

export default function EverythingHandledSection() {
  return (
    <section className="relative py-20 bg-muted overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-primary">
            We Handle Everything For You
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            All you have to do is book your flight – we take care of the rest. From paperwork and SIM card to accommodation and school registration, you just come to Turkey. That’s it.
          </p>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, idx) => (
            <motion.div
              key={item.title}
              className="bg-card rounded-xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-primary"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              viewport={{ once: true }}
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-primary">{item.title}</h3>
              <p className="text-muted-foreground text-base">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
