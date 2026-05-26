export type PostSection = {
  heading: string;
  body: string;
};

export type Post = {
  slug: string;
  title: string;
  date: string;
  author: string;
  readTime: string;
  category: string;
  coverImage: string;
  excerpt: string;
  intro: string;
  sections: PostSection[];
};

export const posts: Post[] = [
  {
    slug: 'building-prosperity-from-the-ground-up',
    title: 'Building Prosperity from the Ground Up: The Story and Vision of the Amajuba Economic Chamber of Commerce',
    date: 'May 2026',
    author: 'Themba Khanyile, Chairperson',
    readTime: '8 min read',
    category: 'Chamber Insight',
    coverImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2940&auto=format&fit=crop',
    excerpt:
      'In a region where economic promise has long outpaced economic reality, a new institution has risen to bridge the gap — the Amajuba Economic Chamber of Commerce. This is its story.',
    intro:
      'In a region where economic promise has long outpaced economic reality, a new institution has risen to bridge the gap — the Amajuba Economic Chamber of Commerce. This is its story.',
    sections: [
      {
        heading: 'A Region of Untapped Potential',
        body: `The Amajuba District of KwaZulu-Natal sits at the heart of one of South Africa's most historically significant industrial corridors. Home to Newcastle — once a steel and manufacturing powerhouse — and surrounded by agricultural hinterland stretching across Dannhauser, Utrecht, Charlestown, Osizweni, and Madadeni, the district has all the ingredients for sustained economic prosperity.

Yet for too long, communities here have remained on the margins of the formal economy. Limited access to information about government procurement, poor connections to business support networks, and a fragmented approach to local economic development have left enormous potential unrealised. The Amajuba Economic Chamber of Commerce was founded with a clear-eyed understanding of this gap — and an equally clear mandate to close it.`,
      },
      {
        heading: 'Our Founding Purpose',
        body: `Registered in 2026 (Reg No: 2026 / 354235 / 08), the Chamber was established as a structured, governance-driven platform to facilitate growth, innovation, and community empowerment across all sectors of the Amajuba economy.

The founding vision is unambiguous: to be the leading catalyst for sustainable economic development and inclusive prosperity in the district. The mission is to operationalise that vision through concrete, measurable intervention — not empty rhetoric, but structured programmes, real partnerships, and accountable leadership.

At its core, the Chamber's value proposition is this: "Developing integrated competence — woven from knowledge, skills, and attitudes — to drive economic transformation and sustainable livelihoods across all sectors within 3–5 years."`,
      },
      {
        heading: 'Three Sectors, One Strategy',
        body: `The Chamber's economic development framework is organised across three interconnected sectors that mirror the standard economic classification model:

**Primary Sector (Extraction):** Agriculture and mining form the foundation of the Amajuba economy. The Chamber advocates for small-scale farmers, supports agri-business development, and works to connect primary producers with secondary processors and market access networks.

**Secondary Sector (Manufacturing & Processing):** Newcastle's industrial heritage in steel, textiles, and chemicals positions the region uniquely for manufacturing revival. The Chamber facilitates connections between manufacturers, logistics providers, and export market opportunities — while pushing for policies that make the district more competitive for industrial investment.

**Tertiary Sector (Services & Distribution):** The fastest-growing segment of the economy, services — from professional services to retail, logistics, and digital — represents the day-to-day economic engine of communities. The Chamber supports service-sector SMMEs through business incubation, mentorship, and market access.

Each sector is supported by a dedicated departmental head within the Chamber's governance structure, ensuring that strategic direction translates into focused, ground-level action.`,
      },
      {
        heading: 'Community Empowerment at the Core',
        body: `What distinguishes the Amajuba Economic Chamber from a traditional business lobby is its deep commitment to community-level economic empowerment. The Chamber operates a flagship Community Capacity-Building Programme, implemented in partnership with the Newcastle Local Municipality and Amajuba District Municipality's Local Economic Development (LED) units.

This programme addresses a critical gap: many community members, cooperatives, SMMEs, and grassroots organisations possess the drive to grow — but lack the knowledge to navigate government systems, procurement processes, and development funding mechanisms.

The programme delivers structured, accredited training in five key areas:
- **Tendering & Procurement:** Understanding how government buys goods and services, and how businesses can ethically and competitively participate.
- **Governance Literacy:** Building awareness of municipal structures, ward committees, councillor accountability, and civic rights.
- **Fund Management:** Teaching responsible use of development funding, project budgeting, and sustainability planning.
- **Community Leadership:** Developing participatory governance skills, conflict resolution capabilities, and community organising capacity.
- **Economic Participation:** LED structures, cooperative models, youth enterprise, and informal trader development.

Critically, training is delivered by accredited local facilitators drawn from within the communities themselves — creating paid employment opportunities and building a sustainable community-owned training ecosystem.`,
      },
      {
        heading: 'Governance Built for Accountability',
        body: `The Chamber's internal governance architecture reflects the seriousness with which it approaches its public mandate. A cascading leadership model ensures clear accountability at every level:

At the apex sits the President/Chairperson, responsible for strategic vision, external stakeholder representation, and final policy authority. The Vice-Chairperson (Strategy & Innovation) drives strategic planning, business intelligence, and performance monitoring. Corporate Services — comprising the Secretary, Treasurer, and Community Head — manage operations, finances, and stakeholder relations respectively.

Departmental Heads cover Business Incubation & Support, Government Relations & Policy, and Tourism, Transport & Logistics — ensuring that no major economic domain falls outside the Chamber's active attention.

This structure is not ceremonial. Each level carries defined responsibilities and is held to measurable outcomes. Transparency and accountability are non-negotiable principles.`,
      },
      {
        heading: 'The Road Ahead',
        body: `The Chamber's strategic framework sets a 3–5 year horizon for transformative impact. In the near term, priorities include expanding the community capacity-building programme across all six district areas, establishing a formal business incubation hub, deepening LED partnerships with both Newcastle Local Municipality and Amajuba District Municipality, and creating structured pathways for youth and informal sector participation in the formal economy.

In the medium term, the focus shifts to sector-specific investment facilitation — bringing new manufacturing investment into the Secondary Sector, connecting Primary Sector producers to value chains, and positioning the district as a hub for services and logistics in the broader KwaZulu-Natal economy.

The long-term vision is a district where inclusive prosperity is not an aspiration but a reality — where communities are informed, businesses are connected, and economic growth is shared.

The Amajuba Economic Chamber of Commerce exists to make that future inevitable.`,
      },
    ],
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
