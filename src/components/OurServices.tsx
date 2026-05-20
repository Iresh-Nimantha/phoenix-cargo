import { motion } from 'motion/react';
import TiltCard from '../animations/TiltCard';
import { useContent } from '../hooks/useContent';

const defaultServicesList = [
  {
    title: 'SEA FREIGHT (FCL / LCL)',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
    items: ['FCL (Full Container Load)', 'LCL (Less Than Container Load)', 'Port-to-Port & Door-to-Door', 'Cargo consolidation', 'Compliance handling'],
    gradient: 'from-blue-600/10 to-cyan-500/10',
  },
  {
    title: 'AIR FREIGHT',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600&auto=format&fit=crop',
    items: ['Express shipments', 'High-value cargo handling', 'Cargo booking & coordination', 'Global delivery solutions'],
    gradient: 'from-orange-600/10 to-amber-500/10',
  },
  {
    title: 'ROAD & RAIL FREIGHT',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=600&auto=format&fit=crop',
    items: ['Integrated Road & Rail', 'Flexible Multi-Modal Routing', 'Efficient Overland Transport'],
    gradient: 'from-red-600/10 to-rose-500/10',
  },
  {
    title: 'CUSTOMS CLEARANCE',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
    items: ['Customs Declarations', 'HS Code Classification', 'Compliance Coordination'],
    gradient: 'from-indigo-600/10 to-blue-500/10',
  },
  {
    title: 'COURIER & EXPRESS CARGO',
    image: 'https://images.unsplash.com/photo-1566576206968-07b988f553a1?q=80&w=600&auto=format&fit=crop',
    items: ['International Document Delivery', 'Urgent Parcel Delivery', 'Fast, Door-to-Door Service'],
    gradient: 'from-purple-600/10 to-pink-500/10',
  },
  {
    title: 'PROJECT CARGO HANDLING',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop',
    items: ['Heavy Lift & OOG Cargo', 'Custom Logistics Planning', 'Site Inspection & Surveys', 'Equipment Management', 'End-to-End Tracking'],
    gradient: 'from-green-600/10 to-emerald-500/10',
  },
  {
    title: 'PHARMACEUTICAL CARGO HANDLING',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop',
    items: ['Strict Temperature Controls', 'Compliant with Standards', 'Specialized Handling Protocols', 'Pharma Facility Access'],
    gradient: 'from-teal-600/10 to-cyan-500/10',
  },
  {
    title: 'HAZARDOUS CARGO HANDLING',
    image: 'https://images.unsplash.com/photo-1606166187734-a4cb74079027?q=80&w=600&auto=format&fit=crop',
    items: ['Safe & Compliant Handling', 'Regulations Adherence (IMDG, IATA)', 'Hazard Containerization', 'Documentation & Declarations'],
    gradient: 'from-yellow-600/10 to-orange-500/10',
  },
];

const defaultData = {
  sectionTitle: 'OUR SERVICES',
  sectionDescription: 'Alliance Freight (Pvt) Ltd offers a complete range of freight forwarding and logistics services designed to support global trade and supply chain efficiency.',
  service1Title: '',
  service1Items: '',
  service1Image: '',
  service2Title: '',
  service2Items: '',
  service2Image: '',
  service3Title: '',
  service3Items: '',
  service3Image: '',
  service4Title: '',
  service4Items: '',
  service4Image: '',
  service5Title: '',
  service5Items: '',
  service5Image: '',
  service6Title: '',
  service6Items: '',
  service6Image: '',
  service7Title: '',
  service7Items: '',
  service7Image: '',
  service8Title: '',
  service8Items: '',
  service8Image: '',
};

export default function OurServices() {
  const { content } = useContent('services', defaultData);
  const data = { ...defaultData, ...content };

  // Dynamically overwrite/build cards based on CMS input
  const displayServices = defaultServicesList.map((item, idx) => {
    const customNum = idx + 1;
    const titleKey = `service${customNum}Title` as keyof typeof data;
    const itemsKey = `service${customNum}Items` as keyof typeof data;
    const imgKey = `service${customNum}Image` as keyof typeof data;

    const customTitle = data[titleKey];
    const customItems = data[itemsKey];
    const customImg = data[imgKey];

    return {
      title: customTitle || item.title,
      image: customImg || item.image,
      items: customItems
        ? customItems.split('\n').filter((x: string) => x.trim() !== '')
        : item.items,
      gradient: item.gradient,
    };
  });

  return (
    <section
      id="services"
      className="relative w-full text-[#0B2545] px-6 py-12 md:py-16 flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/bg.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-[#EBEBEB]/90 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4 leading-tight break-words">
            {data.sectionTitle}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-semibold">
            {data.sectionDescription}
          </p>
        </motion.div>

        {/* 3D Stack Distribution Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayServices.map((service, index) => {
            const col = index % 4;
            const row = Math.floor(index / 4);
            const isMobileViewport = typeof window !== 'undefined' && window.innerWidth < 768;
            const xOffset = isMobileViewport ? 0 : (col === 0 ? 200 : col === 1 ? 80 : col === 2 ? -80 : -200);
            const yOffset = isMobileViewport ? 20 : (row === 0 ? 100 : -100);
            const startRotate = isMobileViewport ? 0 : (index * 4 - 14);

            return (
              <motion.div
                key={index}
                initial={{
                  x: xOffset,
                  y: yOffset,
                  rotate: startRotate,
                  opacity: 0,
                  scale: 0.85
                }}
                whileInView={{
                  x: 0,
                  y: 0,
                  rotate: 0,
                  opacity: 1,
                  scale: 1
                }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{
                  type: 'spring',
                  stiffness: 70,
                  damping: 14,
                  delay: index * 0.08
                }}
              >
                <TiltCard className="group h-full" maxTilt={8} glare={true}>
                  <div className={`relative bg-white/70 backdrop-blur-sm border border-white/60 p-6 rounded-2xl shadow-sm group-hover:shadow-2xl group-hover:shadow-[#0B2545]/8 transition-all duration-500 h-full overflow-hidden`}>
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />

                    {/* Image with 3D zoom */}
                    <div className="relative overflow-hidden rounded-lg mb-4 shadow-inner">
                      <motion.img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-32 object-cover"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        whileHover={{ scale: 1.12, rotateZ: 1 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
                      />
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </div>

                    <div className="relative z-10">
                      <h3 className="font-bold text-[#0B2545] mb-3 text-lg leading-tight uppercase">
                        {service.title}
                      </h3>
                      <ul className="space-y-1.5">
                        {service.items.map((item, i) => (
                          <motion.li
                            key={i}
                            className="text-gray-700 text-xs flex gap-2 items-start"
                            whileHover={{ x: 4 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            <span className="text-cyan-500 mt-0.5 text-[8px]">●</span>
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom glow line */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
