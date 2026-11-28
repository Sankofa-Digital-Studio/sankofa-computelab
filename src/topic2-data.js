export const TOPIC2_TITLE = 'CPN5 Topic 2 · Networking & Communication Skills'

export const TOPIC2_MODULES = [
  {
    id: 'topic2-section1a',
    sectionCode: '1A',
    releaseScope: 'wave1',
    category: 'classification',
    title: 'Network Types and Coverage',
    leakCode: 'THEORY_RECALL',
    nextAction: 'Spot the geographic coverage clue first before classifying LAN, MAN, WAN, or Internet-as-WAN.',
    concept: {
      summary:
        'A network connects two or more devices so they can communicate and share data or resources. In CPN5 Topic 2, network types are classified by geographic coverage area—not by how many computers are on a desk.',
      keyPoints: [
        'LAN (Local Area Network) covers a small, contained area such as one classroom, computer lab, office, home, or single building.',
        'MAN (Metropolitan Area Network) links multiple buildings or sites across one city or metropolitan area (e.g. municipal offices or college campuses in the same city).',
        'WAN (Wide Area Network) connects networks across a very large geographic distance such as different provinces, countries, or continents.',
        'The Internet is the world\'s largest global WAN because it interconnects millions of smaller networks worldwide; local LANs and MANs reach the Internet through Internet Service Providers (ISPs).',
      ],
    },
    cbtTip:
      'Exam trap: Do not guess from the phrase "many branches" alone—find the distance clue and use the 3-step answer frame: "It is a [LAN/MAN/WAN] because the scenario covers [coverage clue]."',
    triggerTable: [
      {
        contrast: 'LAN vs MAN',
        rule: 'LAN stays inside one room, office, or single building; MAN links separate buildings across one city or metropolitan area.',
      },
      {
        contrast: 'MAN vs WAN',
        rule: 'MAN is restricted to one city/metro area; WAN spans across provinces, countries, or continents.',
      },
      {
        contrast: 'Computer count vs Coverage area',
        rule: 'Do not classify by device count; 50 PCs in one lab is still a LAN, while 3 offices in 3 provinces form a WAN.',
      },
      {
        contrast: 'Internet vs Local LAN',
        rule: 'A local LAN serves one site privately; the Internet is the global public WAN that LANs join via an ISP.',
      },
    ],
    guidedPractice: {
      title: 'Coverage Clue Classification Ladder',
      scenario:
        'Classify four South African scenarios: (1) 35 PCs wired in a TVET computer lab, (2) three city library branches linked across Tshwane, (3) logistics depots linked across Johannesburg, Durban, and Cape Town, and (4) learners opening public web portals via an ISP.',
      steps: [
        'Read each scenario fully and underline the place or distance words ("one TVET computer lab", "across Tshwane", "Johannesburg, Durban, and Cape Town", "public web portals via an ISP").',
        'Ask whether each clue is local (one site), city-wide (one metro), or wide-area (provinces/countries/global).',
        'Classify: (1) LAN, (2) MAN, (3) WAN, and (4) Internet as a global WAN accessed through an ISP.',
        'Write every answer in the exam frame: "It is a [LAN/MAN/WAN] because the scenario covers [coverage clue]."',
      ],
    },
    quickCheck: [
      {
        id: 't2-s1a-q1',
        prompt: 'A college connects 40 desktop computers and two printers inside a single campus computer laboratory. Which network type is this, and why?',
        options: [
          'MAN, because 40 computers is a medium-sized group',
          'LAN, because the connected devices are limited to one local laboratory',
          'WAN, because printers and computers are different device types',
          'Internet, because every classroom network is public',
        ],
        correctIndex: 1,
        rationale: 'Coverage area—not computer count—decides the type. One computer lab in one building is a Local Area Network (LAN).',
        leak: 'THEORY_RECALL',
      },
      {
        id: 't2-s1a-q2',
        prompt: 'A municipality links its traffic department, rates office, and main city hall located across different suburbs of the same city. Which classification fits best?',
        options: [
          'LAN, because all departments belong to one employer',
          'MAN, because the sites are linked across one city/metropolitan area',
          'WAN, because more than two offices are connected',
          'Peer-to-Peer, because there are three branches',
        ],
        correctIndex: 1,
        rationale: 'Multiple sites connected within a single city or metropolitan area form a Metropolitan Area Network (MAN).',
        leak: 'INSTRUCTION_CONTROL',
      },
      {
        id: 't2-s1a-q3',
        prompt: 'Why is the Internet classified as the world\'s largest WAN, and how do local networks usually reach it?',
        options: [
          'It links only one building per country using Bluetooth',
          'It interconnects networks globally across countries and continents, reached via Internet Service Providers (ISPs)',
          'It operates without routers or external service providers inside one office',
          'It stores all data on one local USB drive shared by every city',
        ],
        correctIndex: 1,
        rationale: 'The Internet spans the globe connecting countless smaller networks, making it the largest WAN, with LANs and MANs connecting through ISPs.',
        leak: 'THEORY_RECALL',
      },
    ],
    evidenceTask: {
      prompt: 'Build a Topic 2 Section 1A coverage-clue table covering LAN, MAN, WAN, and Internet-as-WAN using the 3-step answer frame.',
      deliverables: [
        '4-row coverage-clue classification table (LAN, MAN, WAN, Internet via ISP)',
        'Three complete exam-frame sentences ("It is a ... because the scenario covers ...")',
      ],
      checklist: [
        { id: 't2-s1a-chk1', label: 'Distinguished LAN, MAN, and WAN strictly by geographic coverage clue' },
        { id: 't2-s1a-chk2', label: 'Explained why the Internet is a global WAN and named the role of an ISP' },
        { id: 't2-s1a-chk3', label: 'Used the full "type + coverage clue" answer frame on all practice scenarios' },
      ],
    },
  },
  {
    id: 'topic2-section1b',
    sectionCode: '1B',
    releaseScope: 'wave1',
    category: 'architecture',
    title: 'Network Architectures & Components',
    leakCode: 'THEORY_RECALL',
    nextAction: 'Ask who controls resources and what role each device plays before selecting Client-Server, P2P, or a hardware component.',
    concept: {
      summary:
        'Network architecture describes how computers are organised and how data, tasks, and access control are shared. Every component in a network has one clear operational job—identify the job in the scenario before naming the device.',
      keyPoints: [
        'Client-Server architecture uses a central server to store data, manage security/logins, and provide services while client workstations request and use those services.',
        'Peer-to-Peer (P2P) architecture links equal computers that share files or printers directly with no central server; Internet P2P extends direct sharing across the Internet using suitable P2P software.',
        'Core LAN and inter-network devices have distinct jobs: Switch connects wired devices inside one LAN; Router forwards traffic between different networks or to the Internet; Wireless Access Point (WAP) lets wireless devices join a LAN.',
        'Interface and provider hardware: a NIC (Network Interface Card) allows a computer to connect to a network, while a Modem converts signals between a local network and an ISP line.',
      ],
    },
    cbtTip:
      'Exam trap: Never confuse a Switch (connects devices INSIDE one LAN) with a Router (connects BETWEEN different networks or links a LAN to the Internet), and always justify components using the frame: "It is a [component] because it [role clue]."',
    triggerTable: [
      {
        contrast: 'Client-Server vs Peer-to-Peer (P2P)',
        rule: 'Client-Server has a central server controlling files, backups, and security; P2P uses equal peers sharing directly without a central server.',
      },
      {
        contrast: 'Server vs Client / Workstation',
        rule: 'A Server provides shared storage, printing, or authentication services; a Client requests and uses those services.',
      },
      {
        contrast: 'Switch vs Router',
        rule: 'A Switch connects multiple wired devices inside a single LAN; a Router connects separate networks together and routes traffic to the Internet.',
      },
      {
        contrast: 'Wireless Access Point (WAP) vs NIC vs Modem',
        rule: 'WAP lets wireless devices join the LAN; NIC is the computer\'s own network adapter; Modem converts signals for the ISP communication line.',
      },
    ],
    guidedPractice: {
      title: 'Role-Clue Architecture & Device Diagnostic',
      scenario:
        'A campus lab uses one central machine for learner logins and shared assignments, links 25 wired PCs in the room, connects tablets wirelessly, and routes traffic out to the ISP.',
      steps: [
        'Ask "Who controls data and logins?": one central machine provides files and controls access, proving Client-Server architecture (the central unit is the Server; the 25 PCs are Clients).',
        'Identify the device connecting the 25 wired PCs inside that single lab as a Switch.',
        'Identify the device allowing tablets to join the local campus network wirelessly as a Wireless Access Point (WAP).',
        'Identify the device linking the campus LAN to external networks as a Router, working with a Modem at the ISP line and a NIC inside each PC.',
      ],
    },
    quickCheck: [
      {
        id: 't2-s1b-q1',
        prompt: 'Four home laptops share a folder of photos directly with one another without any dedicated central server controlling logins. Which architecture is this?',
        options: [
          'Client-Server architecture',
          'Peer-to-Peer (P2P) architecture',
          'Wide Area mainframe architecture',
          'Centralised database server architecture',
        ],
        correctIndex: 1,
        rationale: 'In a Peer-to-Peer network, equal devices share files or resources directly with each other without a central server.',
        leak: 'THEORY_RECALL',
      },
      {
        id: 't2-s1b-q2',
        prompt: 'A technician installs a box in a school lab purely to connect 30 wired workstations to one another inside the same LAN. Which component is this?',
        options: [
          'Switch, because it connects wired devices inside one local network',
          'Modem, because it provides central user authentication',
          'Router, because it only pairs Bluetooth headphones',
          'Client workstation, because it requests homework files',
        ],
        correctIndex: 0,
        rationale: 'A switch connects multiple wired devices inside a single LAN, whereas a router connects different networks together.',
        leak: 'INSTRUCTION_CONTROL',
      },
      {
        id: 't2-s1b-q3',
        prompt: 'Which device allows staff laptops and smartphones to join a local office network wirelessly, and which device forwards traffic between that office LAN and the Internet?',
        options: [
          'NIC joins wirelessly; Switch forwards to the Internet',
          'Wireless Access Point lets wireless devices join the LAN; Router forwards traffic between networks',
          'Modem stores user passwords; Client connects separate cities',
          'Server connects wirelessly; NIC connects different countries',
        ],
        correctIndex: 1,
        rationale: 'A Wireless Access Point provides wireless LAN access, while a Router connects separate networks and routes traffic to the Internet.',
        leak: 'INSTRUCTION_CONTROL',
      },
    ],
    evidenceTask: {
      prompt: 'Complete a Network Architecture & Component Role Table separating Client-Server vs P2P and matching all seven components to one scenario clue each.',
      deliverables: [
        'Client-Server vs Peer-to-Peer comparison (control, storage, cost, ideal setting)',
        'Component role table for Server, Client, Switch, Router, Wireless Access Point, NIC, and Modem',
      ],
      checklist: [
        { id: 't2-s1b-chk1', label: 'Contrasted Client-Server, local P2P, and Internet P2P accurately' },
        { id: 't2-s1b-chk2', label: 'Separated Switch (inside one LAN) from Router (between networks) clearly' },
        { id: 't2-s1b-chk3', label: 'Justified Server, Client, WAP, NIC, and Modem using the role-clue frame' },
      ],
    },
  },
  {
    id: 'topic2-section2a',
    sectionCode: '2A',
    releaseScope: 'wave1',
    category: 'digital-era',
    title: 'Networks and the Digital Era',
    leakCode: 'INSTRUCTION_CONTROL',
    nextAction: 'Pair every e-concept name with a concrete explanation of what the network enables in the scenario.',
    concept: {
      summary:
        'We live in the Information Age, where networks underpin communication, access to information, and digital public and commercial services. In Topic 2 exams, naming an "e-concept" without explaining what the network enables earns only partial marks.',
      keyPoints: [
        'The Information Age relies on networks to deliver rapid communication, global connectability, and wide access to up-to-date information.',
        'e-Collaboration lets people in different locations work together on shared files, plans, or online meetings in real time.',
        'e-Learning / e-Education uses networks for online lessons, study portals, digital assessments, and remote lecturer support.',
        'e-Health (digital patient records, telemedicine), e-Government (online tax, ID, and municipal services), and e-Commerce (buying/selling goods or services online) depend on reliable networks.',
      ],
    },
    cbtTip:
      'Exam trap: Never write only "e-learning" or "e-government" on a 2–4 mark question—name the exact e-concept AND explain what the network enables (who connects, what information moves, and the practical benefit).',
    triggerTable: [
      {
        contrast: 'e-Collaboration vs General Communication',
        rule: 'General communication sends messages/calls; e-Collaboration involves teams actively working together on shared tasks or documents via a network.',
      },
      {
        contrast: 'e-Learning / e-Education vs e-Commerce',
        rule: 'e-Learning delivers educational materials, portals, and assessments online; e-Commerce conducts buying, selling, and online orders.',
      },
      {
        contrast: 'e-Health vs e-Government',
        rule: 'e-Health connects clinics, doctors, and patient records; e-Government delivers public state/municipal services to citizens online.',
      },
      {
        contrast: 'Concept Name Only vs Full Exam Answer',
        rule: 'Naming "e-Health" gets 1 mark; adding "networks let clinics share patient records and consult specialists remotely" secures full marks.',
      },
    ],
    guidedPractice: {
      title: 'Digital Era E-Concept Justification Drill',
      scenario:
        'Read four scenarios: (1) citizens renewing vehicle licences on a state portal, (2) rural clinics sending X-rays to city doctors, (3) two campus lecturers co-editing a timetable online, and (4) students submitting quizzes on a learning portal.',
      steps: [
        'Find the domain clue in each scenario (state portal, clinic X-rays, co-editing timetable, student quiz portal).',
        'Name the exact concept: (1) e-Government, (2) e-Health, (3) e-Collaboration, (4) e-Learning / e-Education.',
        'Add the network action: explain how the network connects users and moves information faster or across distance.',
        'Verify that no answer is just a one-word label without a textbook explanation.',
      ],
    },
    quickCheck: [
      {
        id: 't2-s2a-q1',
        prompt: 'A rural clinic uploads a patient\'s scan over a network so a specialist doctor at a city hospital can review it and recommend treatment. Which concept does this illustrate?',
        options: [
          'e-Commerce',
          'e-Health',
          'Peer-to-Peer gaming',
          'File compression',
        ],
        correctIndex: 1,
        rationale: 'Using networks to share patient medical records and deliver remote medical consultation is e-Health.',
        leak: 'INSTRUCTION_CONTROL',
      },
      {
        id: 't2-s2a-q2',
        prompt: 'Two project team members in different provinces edit the same online budget document simultaneously and discuss changes on a video call. Which term best describes this?',
        options: [
          'e-Collaboration, because the network enables team members in different places to work together on shared tasks',
          'e-Government, because budgets always belong to municipalities',
          'Local printing, because both users have monitors',
          'Offline archiving, because no network is needed',
        ],
        correctIndex: 0,
        rationale: 'e-Collaboration occurs when networked users work together across locations on shared documents and decisions.',
        leak: 'INSTRUCTION_CONTROL',
      },
      {
        id: 't2-s2a-q3',
        prompt: 'On a 3-mark exam question asking how networks support e-Government, which answer earns full credit?',
        options: [
          '"e-Government."',
          '"It uses computers."',
          '"e-Government uses networks so citizens can submit applications, access public records, and pay municipal accounts online without queueing."',
          '"It is a switch that connects one lab."',
        ],
        correctIndex: 2,
        rationale: 'Full marks require naming the e-concept and explaining clearly what the network enables for citizens and public departments.',
        leak: 'INSTRUCTION_CONTROL',
      },
    ],
    evidenceTask: {
      prompt: 'Create a Digital Era E-Concept Summary linking Information Age access to e-Collaboration, e-Learning, e-Health, e-Government, and e-Commerce.',
      deliverables: [
        '5-concept summary table (Concept, Scenario Clue, What the Network Enables)',
        'One corrected "weak label vs full exam explanation" rewrite',
      ],
      checklist: [
        { id: 't2-s2a-chk1', label: 'Defined Information Age, improved communication, and access to information' },
        { id: 't2-s2a-chk2', label: 'Matched e-Collaboration, e-Learning, e-Health, e-Government, and e-Commerce to valid clues' },
        { id: 't2-s2a-chk3', label: 'Included a full explanation of what the network enables for every concept' },
      ],
    },
  },
  {
    id: 'topic2-section2b',
    sectionCode: '2B',
    releaseScope: 'wave1',
    category: 'digital-era',
    title: 'Reasons for Using Networks',
    leakCode: 'INSTRUCTION_CONTROL',
    nextAction: 'Separate Resource Sharing, Centralisation, Communication, and EFT, and state both benefits and risks.',
    concept: {
      summary:
        'Organisations invest in networks for practical operational reasons: faster communication, sharing expensive resources, centralising data, and transferring files or funds electronically. Examiners also test whether you recognise network risks alongside benefits.',
      keyPoints: [
        'Communication & collaboration: email, messaging, VoIP, and online meetings allow instant contact regardless of distance.',
        'Resource sharing: multiple users share hardware (one laser printer), software licenses, storage, and a single Internet link, cutting equipment cost.',
        'Centralisation: storing master files on one central server ensures everyone works from the same up-to-date copy rather than conflicting local duplicates, and simplifies backups.',
        'File transfer & Electronic Funds Transfer (EFT): networks move documents rapidly and process electronic payments securely; however, networks also introduce security threats and server/link dependency (single point of failure).',
      ],
    },
    cbtTip:
      'Exam trap: Do not blur Resource Sharing (sharing one printer or Internet link to save cost) with Centralisation (keeping one master copy of data in a central place to prevent conflicting versions).',
    triggerTable: [
      {
        contrast: 'Resource Sharing vs Centralisation',
        rule: 'Resource sharing shares printers, storage, or an Internet link to cut cost; Centralisation keeps one master data copy in one place so records stay consistent.',
      },
      {
        contrast: 'File Transfer vs EFT',
        rule: 'File transfer sends digital documents/data between computers; EFT (Electronic Funds Transfer) moves money digitally between bank accounts over a network.',
      },
      {
        contrast: 'Network Benefit vs Network Risk',
        rule: 'Benefits include speed, cost savings, and consistency; Risks include malware/unauthorised access and downtime if a central server or link fails.',
      },
      {
        contrast: 'Single Central Copy vs Local USB Copies',
        rule: 'A central server file keeps every user on the latest version; passing USB drives around creates conflicting outdated copies.',
      },
    ],
    guidedPractice: {
      title: 'Why the Business Needs a Network — Benefit & Risk Audit',
      scenario:
        'A 20-staff accounting office currently carries flash drives between desks, buys a separate printer for every room, and queues at the bank to pay suppliers.',
      steps: [
        'Recommend Resource Sharing: connect all 20 PCs to one shared high-speed office printer and one Internet connection to reduce hardware costs.',
        'Recommend Centralisation: store client ledgers in one central server folder so staff never edit conflicting USB copies and backups run from one location.',
        'Recommend File Transfer & EFT: send client statements digitally and pay suppliers via Electronic Funds Transfer instead of manual bank queues.',
        'Note the operational risk: protect the central server with passwords/antivirus and backups because unauthorised access or server downtime affects everyone.',
      ],
    },
    quickCheck: [
      {
        id: 't2-s2b-q1',
        prompt: 'A school connects 30 lab computers to one high-speed network printer instead of buying 30 separate printers. Which reason for using a network does this show?',
        options: [
          'Resource sharing to reduce hardware cost',
          'Electronic Funds Transfer (EFT)',
          'Peer-to-Peer gaming',
          'Increasing conflicting file copies',
        ],
        correctIndex: 0,
        rationale: 'Allowing many users on a network to share one printer, Internet line, or storage device is hardware resource sharing.',
        leak: 'INSTRUCTION_CONTROL',
      },
      {
        id: 't2-s2b-q2',
        prompt: 'Why is keeping a company\'s price list in one central network folder better than emailing copies or passing USB drives around?',
        options: [
          'It prevents every user from seeing the file',
          'Centralisation ensures all staff work from one updated master copy instead of conflicting versions',
          'It turns a LAN into a WAN automatically',
          'It removes the need for backups or security',
        ],
        correctIndex: 1,
        rationale: 'Centralisation keeps data in one place so users access the same current version and IT can back it up consistently.',
        leak: 'THEORY_RECALL',
      },
      {
        id: 't2-s2b-q3',
        prompt: 'A business adopts a centralised network for file sharing and EFT payments. Which risk must management still control?',
        options: [
          'Printers can no longer be shared on a network',
          'Security threats (unauthorised access/malware) and downtime if the central server or network link fails',
          'EFT forces staff to queue physically at the bank',
          'Centralised servers prevent email communication',
        ],
        correctIndex: 1,
        rationale: 'While networks improve speed, sharing, and centralisation, they introduce cybersecurity risks and single-point-of-failure dependency.',
        leak: 'INSTRUCTION_CONTROL',
      },
    ],
    evidenceTask: {
      prompt: 'Produce a Reasons for Using Networks use-case table covering Communication, Resource Sharing, Centralisation, File Transfer/EFT, and one risk control.',
      deliverables: [
        '5-row network use-case table (Reason, Practical Example, Benefit, Risk/Control)',
        'Short paragraph contrasting Resource Sharing vs Centralisation in an office scenario',
      ],
      checklist: [
        { id: 't2-s2b-chk1', label: 'Distinguished Resource Sharing from Centralisation with clear office examples' },
        { id: 't2-s2b-chk2', label: 'Included Communication, File Transfer, and EFT accurately' },
        { id: 't2-s2b-chk3', label: 'Stated at least two network risks (security and downtime/dependency) with controls' },
      ],
    },
  },
  {
    id: 'topic2-section3',
    sectionCode: '3',
    releaseScope: 'wave2',
    category: 'consolidation',
    title: 'Topic 2 Consolidation & Revision Map',
    leakCode: 'TIME_DISCIPLINE',
    nextAction: 'Link Topic 2\'s two movements using the 3-step exam method (Find clue -> Name concept -> Explain with keyword).',
    concept: {
      summary:
        'Topic 2 connects two movements: first, how networks are built and classified (Types & Architectures in 1A–1B); second, why people use them in the Digital Era (2A–2B). Under timed exam conditions, the 3-step method prevents rushed acronym errors.',
      keyPoints: [
        'Movement 1 (Structure): Coverage area determines LAN, MAN, or WAN (with Internet as global WAN); internal control determines Client-Server vs Peer-to-Peer; device job determines Switch, Router, WAP, NIC, and Modem.',
        'Movement 2 (Purpose): Networks enable Information Age e-services (e-Collaboration, e-Learning, e-Health, e-Government, e-Commerce) and deliver communication, resource sharing, centralisation, file transfer, and EFT.',
        'The 3-step Topic 2 exam method: (1) Find the scenario clue, (2) Name the exact concept/device, (3) Explain using a textbook keyword (never write a bare acronym unless asked only for the acronym).',
        'High-risk exam pairs to audit before Mastery: LAN/MAN/WAN, Switch/Router, Client-Server/P2P, and Resource Sharing/Centralisation.',
      ],
    },
    cbtTip:
      'Exam trap: Under time pressure, students read two words and jump to an acronym. Force a 15-second clue check on location, control, or purpose before writing.',
    triggerTable: [
      {
        contrast: 'Coverage Clue vs Control Clue',
        rule: 'Location/distance words ("one lab", "city", "provinces") select LAN/MAN/WAN; control/storage words ("central server", "equal peers") select Client-Server/P2P.',
      },
      {
        contrast: 'Inside-LAN Device vs Between-Network Device',
        rule: 'Connecting wired PCs in one room = Switch; linking separate networks or reaching the Internet = Router.',
      },
      {
        contrast: 'E-Concept Label vs Operational Reason',
        rule: 'Domain service scenarios ("clinic", "citizen portal", "online shop") point to e-Health/e-Government/e-Commerce; cost/data goals point to Resource Sharing/Centralisation.',
      },
      {
        contrast: 'Bare Acronym vs Complete Justification',
        rule: 'Always attach the scenario clue and textbook keyword ("central server", "geographic area", "shared resource") to secure full marks.',
      },
    ],
    guidedPractice: {
      title: 'Cross-Section 3-Step Revision Map Walkthrough',
      scenario:
        'A regional pharmacy chain links 12 branches across three provinces, uses a central head-office database for stock, connects branch tills via local switches, and runs online customer orders.',
      steps: [
        'Step 1 (Coverage): "12 branches across three provinces" -> WAN (whereas the wired tills inside a single branch form a local LAN).',
        'Step 2 (Architecture & Devices): "central head-office database" -> Client-Server architecture; branch tills connect inside each branch via a Switch, and each branch links outward via a Router.',
        'Step 3 (Digital Era & Reason): "online customer orders" -> e-Commerce; keeping stock in the central database -> Centralisation so every branch sees updated stock levels.',
        'Audit each answer against the 3-step rule: Clue identified -> Concept named -> Textbook keyword included.',
      ],
    },
    quickCheck: [
      {
        id: 't2-s3-q1',
        prompt: 'Which sequence correctly applies the Topic 2 three-step exam method when answering a scenario question?',
        options: [
          'Guess an acronym -> Move on -> Skip explanation',
          'Find the scenario clue -> Name the exact concept -> Explain using a textbook keyword',
          'Write a long story -> Omit the concept name -> Add hardware ports',
          'Copy the question prompt -> Circle random terms -> Submit immediately',
        ],
        correctIndex: 1,
        rationale: 'Finding the clue first prevents recall traps, naming the concept earns identification marks, and explaining with textbook keywords secures justification marks.',
        leak: 'TIME_DISCIPLINE',
      },
      {
        id: 't2-s3-q2',
        prompt: 'A national bank links branches in three provinces, stores client balances on central servers, and lets customers pay accounts online. Which combination is accurate?',
        options: [
          'LAN + Peer-to-Peer + e-Health',
          'WAN + Client-Server + e-Commerce / EFT',
          'MAN + Switch-only + e-Learning',
          'LAN + WAP-only + e-Government',
        ],
        correctIndex: 1,
        rationale: 'Branches across provinces form a WAN, central servers controlling client balances show Client-Server, and online account payments reflect EFT/e-Commerce.',
        leak: 'INSTRUCTION_CONTROL',
      },
      {
        id: 't2-s3-q3',
        prompt: 'A student writes only "Router" for a 3-mark question asking why a school needs one to connect its lab LAN to the Internet. What is missing?',
        options: [
          'Nothing; one word always earns 3 marks',
          'The explanation using the textbook role clue: a router forwards traffic between the school\'s local network and external networks/Internet',
          'Changing the answer to "Bluetooth adapter"',
          'Listing every file extension in Windows Explorer',
        ],
        correctIndex: 1,
        rationale: 'Multi-mark N5 theory questions require both the correct component name and the role explanation showing how it connects different networks.',
        leak: 'TIME_DISCIPLINE',
      },
    ],
    evidenceTask: {
      prompt: 'Compile a one-page Topic 2 Consolidation Revision Map connecting Sections 1A, 1B, 2A, and 2B plus your four high-risk contrast rules.',
      deliverables: [
        'Two-movement Topic 2 Revision Map (Structure 1A–1B -> Purpose 2A–2B)',
        'Four high-risk contrast fixes (LAN/MAN/WAN, Switch/Router, Client-Server/P2P, Resource Sharing/Centralisation)',
      ],
      checklist: [
        { id: 't2-s3-chk1', label: 'Connected Topic 2 Movement 1 (Types & Architectures) to Movement 2 (Digital Era & Reasons)' },
        { id: 't2-s3-chk2', label: 'Applied the 3-step method (Clue -> Concept -> Textbook Keyword) to a multi-part scenario' },
        { id: 't2-s3-chk3', label: 'Recorded clear rules for all four high-risk contrast pairs' },
      ],
    },
  },
  {
    id: 'topic2-mastery',
    sectionCode: 'Mastery',
    releaseScope: 'wave2',
    category: 'consolidation',
    title: 'Networking & Communication Mastery (150 Marks)',
    leakCode: 'TIME_DISCIPLINE',
    nextAction: 'Complete a timed 150-mark Topic 2 Mastery check across Parts A, B, and C and log every leak correction.',
    concept: {
      summary:
        'The Topic 2 Mastery Assessment (150 Marks) tests full Topic 2 readiness across three parts: Part A Theory & Definitions (50 marks), Part B Network Classification & Architectures, and Part C Digital Era & Network Use Cases—strictly within Topic 2 scope.',
      keyPoints: [
        'Part A (Theory & Definitions — 50 marks) requires crisp textbook definitions of network, LAN, MAN, WAN, why the Internet is a WAN, network architecture, and core device roles.',
        'Part B (Classification & Architectures) tests scenario reading: separating LAN/MAN/WAN by coverage clue, Client-Server vs P2P by control/storage, and Switch vs Router vs WAP vs Modem.',
        'Part C (Digital Era & Use Cases) tests e-concepts (e-Collaboration, e-Learning, e-Health, e-Government, e-Commerce) and reasons for networks (Communication, Resource Sharing, Centralisation, File Transfer, EFT, plus risks).',
        'Time & Leak Discipline: pace marks at roughly 1 mark per minute, verify every answer includes clue + concept + keyword, and record repeated leaks (THEORY_RECALL, INSTRUCTION_CONTROL, TIME_DISCIPLINE) in a correction table.',
      ],
    },
    cbtTip:
      'Exam trap: In a 150-mark paper, spending too long on Part A definitions starves Part B and Part C scenario marks. Watch mark allocations (e.g. 9 marks for comparing LAN, MAN, and WAN = 3 clear points each) and log every leak after marking.',
    triggerTable: [
      {
        contrast: 'Part A Definitions (50m) vs Part B/C Scenarios',
        rule: 'Part A rewards exact textbook definitions and comparisons; Parts B and C reward scenario clue extraction plus justification.',
      },
      {
        contrast: 'Mark Allocation Pacing (e.g. 5-mark vs 9-mark)',
        rule: 'Match depth to marks: a 9-mark LAN/MAN/WAN question needs definition + coverage clue + example for each of the three types.',
      },
      {
        contrast: 'THEORY_RECALL vs INSTRUCTION_CONTROL Leak',
        rule: 'THEORY_RECALL means forgetting definitions/roles; INSTRUCTION_CONTROL means knowing terms but ignoring the scenario clue or mark command verb.',
      },
      {
        contrast: 'TIME_DISCIPLINE Leak vs Verification Check',
        rule: 'Rushing drops keywords and swaps Switch/Router; a 20-second final check catches missing justifications before submission.',
      },
    ],
    guidedPractice: {
      title: '150-Mark Mastery Pacing & Leak Correction Audit',
      scenario:
        'During a timed Topic 2 Mastery mock, a learner loses marks by calling a city-wide branch network a WAN, writing "e-Health" without explanation, and leaving two Part C risk questions unfinished.',
      steps: [
        'Diagnose Leak 1 (city-wide called WAN): INSTRUCTION_CONTROL—missed the "same city" coverage clue; fix by underlining location words before classifying MAN.',
        'Diagnose Leak 2 (bare "e-Health" label): INSTRUCTION_CONTROL / THEORY_RECALL—forgot the keyword explanation; fix by adding what the network enables for clinics and patient records.',
        'Diagnose Leak 3 (unfinished Part C): TIME_DISCIPLINE—spent too long on Part A; fix by capping Part A at ~50 minutes and pacing 1 mark per minute.',
        'Log all three items in a Leak Correction Table with the corrected exam-ready response.',
      ],
    },
    quickCheck: [
      {
        id: 't2-m-q1',
        prompt: 'In Part A of the 150-mark Topic 2 Mastery Assessment, a question asks: "Explain LAN, MAN and WAN. (9)". What earns all 9 marks?',
        options: [
          'Writing only the three full names without explanation',
          'Giving the coverage scope, key characteristic, and a valid example for each of LAN, MAN, and WAN',
          'Explaining only LAN in three paragraphs and skipping MAN and WAN',
          'Listing three Word Mail Merge steps instead',
        ],
        correctIndex: 1,
        rationale: 'A 9-mark comparison across three network types expects roughly 3 marks per type: accurate definition/coverage, distinguishing feature, and example.',
        leak: 'TIME_DISCIPLINE',
      },
      {
        id: 't2-m-q2',
        prompt: 'A learner knows the definition of a Switch and a Router, yet picks Router for "connects 20 wired PCs inside one lab" because they rushed. Which leak code applies?',
        options: [
          'EXCEL_REFERENCING',
          'TIME_DISCIPLINE / INSTRUCTION_CONTROL — rushing caused them to ignore the "inside one lab" role clue',
          'MAIL_MERGE',
          'HTML_SYNTAX',
        ],
        correctIndex: 1,
        rationale: 'When a learner knows the concept but misreads or skips the scenario clue under time pressure, the leak is TIME_DISCIPLINE or INSTRUCTION_CONTROL.',
        leak: 'TIME_DISCIPLINE',
      },
      {
        id: 't2-m-q3',
        prompt: 'Which set covers all three parts of the Topic 2 Mastery (150 Marks) scope accurately?',
        options: [
          'Part A: Theory & Definitions (50m) · Part B: Classification & Architectures · Part C: Digital Era & Network Use Cases',
          'Part A: Excel Pivot Tables · Part B: HTML Forms · Part C: SQL Joins',
          'Part A: Mail Merge · Part B: Page Margins · Part C: Zip Compression',
          'Part A: CPU Clock Speed · Part B: HDMI Cables · Part C: Recycle Bin',
        ],
        correctIndex: 0,
        rationale: 'Topic 2 Mastery stays strictly inside Topic 2: Theory & Definitions (50 marks), Network Classification & Architectures, and Digital Era & Reasons for Using Networks.',
        leak: 'THEORY_RECALL',
      },
    ],
    evidenceTask: {
      prompt: 'Complete the Topic 2 Mastery (150 Marks) checklist and submit a Leak Correction Table addressing THEORY_RECALL, INSTRUCTION_CONTROL, and TIME_DISCIPLINE.',
      deliverables: [
        'Completed Topic 2 Mastery 150-mark practice script (Parts A, B, and C)',
        'Leak Correction Table logging weak answers, leak codes, and corrected exam-ready sentences',
      ],
      checklist: [
        { id: 't2-m-chk1', label: 'Completed Part A (50m theory), Part B (classification/architectures), and Part C (digital era/use cases)' },
        { id: 't2-m-chk2', label: 'Applied clue + concept + textbook keyword justification across all scenario answers' },
        { id: 't2-m-chk3', label: 'Compiled a Leak Correction Table fixing THEORY_RECALL, INSTRUCTION_CONTROL, and TIME_DISCIPLINE errors' },
      ],
    },
  },
]
