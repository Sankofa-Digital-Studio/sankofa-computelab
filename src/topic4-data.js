export const TOPIC4_TITLE = 'CPN5 Topic 4 · Internet & Communication Skills'

export const TOPIC4_MODULES = [
  {
    id: 'topic4-section1a',
    sectionCode: '1A',
    releaseScope: 'wave1',
    category: 'apps',
    title: 'Internet Applications and Plug-ins',
    leakCode: 'THEORY_RECALL',
    nextAction: 'Match browser plug-ins and Internet applications to the exact user task they enable before drilling names.',
    concept: {
      summary:
        'An Internet application is software that requires an Internet connection to operate effectively, while a plug-in is add-on software that extends a web browser or app with a specialised function it cannot perform alone.',
      keyPoints: [
        'Think of the web browser as a core toolbox and a plug-in as a specialised attachment added to convert documents, stream audio/video, or run interactive content.',
        'PDF converters/readers enable opening, creating, or converting Portable Document Format files (e.g. invoices or forms) across devices without changing layout.',
        'Legacy and media plug-ins in the N5 syllabus include Adobe Flash Player, Java, QuickTime Player, RealPlayer, and Microsoft Silverlight for rich multimedia or applets.',
        'Exam questions test purpose recognition: state what task the user needs (convert, stream, play, or display) and explain what extra capability the plug-in adds.',
      ],
    },
    cbtTip:
      'Exam trap: Do not answer plug-in questions with just a software brand name—state the missing browser capability and explain why the plug-in or Internet app solves the user task.',
    triggerTable: [
      {
        contrast: 'Internet Application vs Browser Plug-in',
        rule: 'An Internet application runs using Internet connectivity; a plug-in adds an extra specialised capability inside a browser or host program.',
      },
      {
        contrast: 'PDF Reader / Converter vs Media Player Plug-in',
        rule: 'PDF tools view or convert fixed-layout documents; media plug-ins (QuickTime, RealPlayer, Flash, Silverlight) decode audio, video, or interactive content.',
      },
      {
        contrast: 'Java Applet Plug-in vs Plain HTML Page',
        rule: 'Plain HTML displays static text/links natively; Java plug-ins allow small interactive programs (applets) to run inside older browser environments.',
      },
      {
        contrast: 'Purpose-Based Answer vs Name-Only Answer',
        rule: 'Always state: [Plug-in/App] + [Action: convert/stream/play/run] + [Scenario benefit].',
      },
    ],
    guidedPractice: {
      title: 'Scenario-to-Plug-in Matching Ladder',
      scenario:
        'A college receptionist receives a read-only PDF supplier invoice that must be converted into an editable Word document, while a student tries to play an online training video clip.',
      steps: [
        'Identify the first task verb: convert a PDF invoice into editable Word format, and select a PDF converter application/plug-in.',
        'Identify the second task verb: stream/play a multimedia training video, and match a media player plug-in (such as QuickTime or HTML5/media decoder).',
        'Explain why the plain browser alone cannot edit the fixed PDF without the converter add-on.',
        'Verify each answer uses the three-part frame: tool/plug-in name, action verb, and practical reason.',
      ],
    },
    quickCheck: [
      {
        id: 't4-s1a-q1',
        prompt: 'What is the main purpose of a browser plug-in in Topic 4 Section 1A?',
        options: [
          'To replace the computer motherboard',
          'To add an extra specialised function (such as media playback or PDF handling) that the browser cannot perform alone',
          'To delete all files in the Downloads folder',
          'To disable Internet connectivity permanently',
        ],
        correctIndex: 1,
        rationale: 'A plug-in extends a browser or application with specialised functionality such as multimedia playback, applets, or document handling.',
        leak: 'THEORY_RECALL',
      },
      {
        id: 't4-s1a-q2',
        prompt: 'An administrator receives a locked supplier statement in PDF format and needs to edit its table in Word. Which tool purpose fits best?',
        options: [
          'A PDF converter plug-in or utility',
          'A firewall port blocker',
          'A monochrome printer driver',
          'A spreadsheet Sort A-to-Z command',
        ],
        correctIndex: 0,
        rationale: 'PDF converter utilities/plug-ins transform fixed PDF layout files into editable document formats.',
        leak: 'THEORY_RECALL',
      },
      {
        id: 't4-s1a-q3',
        prompt: 'Which response earns full exam marks when identifying an Internet application or plug-in in a scenario?',
        options: [
          'Writing only the product acronym',
          'Naming the plug-in/application, the task action it performs, and why the user needs it in the scenario',
          'Listing five unrelated hardware cables',
          'Copying the scenario sentence unchanged',
        ],
        correctIndex: 1,
        rationale: 'Exam marking requires both the correct tool/plug-in and its functional purpose linked to the scenario.',
        leak: 'INSTRUCTION_CONTROL',
      },
    ],
    evidenceTask: {
      prompt: 'Build an application-and-plug-in purpose table covering PDF converters, Java, QuickTime, RealPlayer, Flash, and Silverlight with one scenario clue each.',
      deliverables: [
        '6-row application-purpose table matching tool to user task',
        'Two worked scenario paragraphs using the 3-part answer frame',
      ],
      checklist: [
        { id: 't4-1a-chk1', label: 'Distinguished an Internet application from a browser plug-in accurately' },
        { id: 't4-1a-chk2', label: 'Matched PDF conversion and multimedia playback tasks to their correct plug-ins' },
        { id: 't4-1a-chk3', label: 'Included functional purpose and scenario link in each written answer' },
      ],
    },
  },
  {
    id: 'topic4-section1b',
    sectionCode: '1B',
    releaseScope: 'wave1',
    category: 'apps',
    title: 'Web Evolution: Web 1.0 to Web 4.0',
    leakCode: 'INSTRUCTION_CONTROL',
    nextAction: 'Spot user-behaviour clues (read-only vs user-created vs semantic vs intelligent) before naming Web 1.0–4.0.',
    concept: {
      summary:
        'Web evolution traces how the World Wide Web progressed from static read-only pages (Web 1.0) to interactive user-generated platforms (Web 2.0), machine-readable linked data (Web 3.0), and intelligent, proactive mobile services (Web 4.0).',
      keyPoints: [
        'Web 1.0 (Read-Only Web): Static HTML pages published by owners; visitors only read information and cannot post comments or upload content.',
        'Web 2.0 (Social / Read-Write Web): Users create, share, comment, collaborate, and tag content on wikis, blogs, and social platforms.',
        'Web 3.0 (Semantic Web): Structured data allows systems to understand meaning, connect related data across sites, and tailor search results.',
        'Web 4.0 (Intelligent / Mobile Symbiotic Web): Always-on, AI-assisted, context-aware services interact proactively across mobile and smart devices.',
      ],
    },
    cbtTip:
      'Exam trap: Do not guess Web 2.0 vs Web 3.0 by how modern a company sounds—look at the user behaviour clue (passive reading, user creation, semantic data linking, or autonomous/AI adaptation).',
    triggerTable: [
      {
        contrast: 'Web 1.0 vs Web 2.0',
        rule: 'Web 1.0 is one-way passive reading of static pages; Web 2.0 enables two-way interaction and user-generated content.',
      },
      {
        contrast: 'Web 2.0 vs Web 3.0',
        rule: 'Web 2.0 connects people to share content; Web 3.0 connects machine-readable meaning (semantic data) across sources.',
      },
      {
        contrast: 'Web 3.0 vs Web 4.0',
        rule: 'Web 3.0 structures linked data; Web 4.0 adds intelligent, mobile, real-time proactive assistance.',
      },
      {
        contrast: 'Clue-First vs Number Guessing',
        rule: 'State the generation AND quote the exact user behaviour clue (e.g. "only displays opening hours" -> Web 1.0).',
      },
    ],
    guidedPractice: {
      title: 'Web Generation Clue Decoder',
      scenario:
        'Compare four sites: (A) a bakery page showing only its address and trading hours, (B) a community recipe wiki where visitors upload photos, (C) a travel engine linking semantic flight/hotel data, and (D) a smart voice assistant predicting traffic delays.',
      steps: [
        'Site A allows passive reading only with zero visitor input -> classify as Web 1.0.',
        'Site B relies on users contributing and editing content -> classify as Web 2.0.',
        'Site C interprets structured meaning across datasets -> classify as Web 3.0.',
        'Site D acts intelligently and proactively on real-time mobile context -> classify as Web 4.0.',
      ],
    },
    quickCheck: [
      {
        id: 't4-s1b-q1',
        prompt: 'A municipal page only displays fixed office hours and a phone number, with no comment box, login, or user uploads. Which web generation does this best represent?',
        options: ['Web 1.0', 'Web 2.0', 'Web 3.0', 'Web 4.0'],
        correctIndex: 0,
        rationale: 'Static, one-way read-only content with no user participation is the defining feature of Web 1.0.',
        leak: 'INSTRUCTION_CONTROL',
      },
      {
        id: 't4-s1b-q2',
        prompt: 'Students collaborate on a shared online encyclopedia where anyone with access can write articles, upload diagrams, and comment on edits. Which generation is shown?',
        options: ['Web 1.0', 'Web 2.0', 'Offline BIOS', 'Batch processing'],
        correctIndex: 1,
        rationale: 'Web 2.0 is the interactive, read-write web built around user-generated content and collaboration.',
        leak: 'THEORY_RECALL',
      },
      {
        id: 't4-s1b-q3',
        prompt: 'How does Web 3.0 differ from Web 2.0 in an exam comparison?',
        options: [
          'Web 3.0 removes all hyperlinks',
          'Web 3.0 focuses on semantic, machine-readable linked data rather than only user-posted social pages',
          'Web 3.0 requires floppy disks',
          'Web 3.0 works only without an Internet connection',
        ],
        correctIndex: 1,
        rationale: 'Web 3.0 structures data semantically so computers can interpret relationships across sources.',
        leak: 'INSTRUCTION_CONTROL',
      },
    ],
    evidenceTask: {
      prompt: 'Create a Web 1.0 to Web 4.0 clue table with one real-world example and one marker justification sentence per generation.',
      deliverables: [
        '4-row web-generation clue table (Web 1.0–4.0)',
        'Written scenario justification explaining why passive vs interactive vs semantic clues differ',
      ],
      checklist: [
        { id: 't4-1b-chk1', label: 'Contrasted read-only Web 1.0 against user-generated Web 2.0 with examples' },
        { id: 't4-1b-chk2', label: 'Distinguished semantic Web 3.0 from intelligent/proactive Web 4.0' },
        { id: 't4-1b-chk3', label: 'Quoted a concrete user-behaviour clue in every justification' },
      ],
    },
  },
  {
    id: 'topic4-section1c',
    sectionCode: '1C',
    releaseScope: 'wave1',
    category: 'apps',
    title: 'Social Platforms and Website Multimedia',
    leakCode: 'THEORY_RECALL',
    nextAction: 'Classify social networking, microblogging, photo/video sharing, and website multimedia elements accurately.',
    concept: {
      summary:
        'Block 4.1 closes with social platforms and website multimedia. Learners must classify platforms by primary purpose and identify multimedia elements (text, audio, video, animation, graphics) along with responsible digital participation.',
      keyPoints: [
        'Social networking platforms build profile-based communities and messaging (e.g. LinkedIn, Facebook); microblogging focuses on short, rapid status updates (e.g. X).',
        'Photo-sharing and video-sharing platforms specialise in publishing visual or streaming media rather than long-form text articles.',
        'Website multimedia combines multiple media forms—text, graphics/images, audio, video, and animation—to make web pages engaging and informative.',
        'Responsible digital choices require checking privacy settings, respecting copyright/consent when sharing media, and evaluating source credibility.',
      ],
    },
    cbtTip:
      'Exam trap: Never claim "all social media platforms are only for video sharing"—match each platform category (networking, microblogging, photo sharing, video sharing) to its primary function.',
    triggerTable: [
      {
        contrast: 'Social Networking vs Microblogging',
        rule: 'Social networking emphasises full profiles, groups, and connections; microblogging centres on brief, frequent public updates.',
      },
      {
        contrast: 'Photo Sharing vs Video Sharing',
        rule: 'Photo sharing curates still images/albums; video sharing hosts and streams recorded or live video clips.',
      },
      {
        contrast: 'Single-Medium Page vs Website Multimedia',
        rule: 'Multimedia combines two or more formats (text + audio/video/animation/graphics) on a webpage.',
      },
      {
        contrast: 'Public Sharing vs Safe Digital Use',
        rule: 'Protect personal data, obtain consent before posting others, and verify copyright before reusing multimedia.',
      },
    ],
    guidedPractice: {
      title: 'Platform & Multimedia Audit',
      scenario:
        'A college careers club wants to post short daily event alerts, share a graduation photo gallery, publish a 3-minute campus tour video, and embed audio interviews on its webpage.',
      steps: [
        'Match short daily status alerts to microblogging.',
        'Match the graduation photo gallery to photo sharing and the campus tour clip to video sharing.',
        'Identify embedded audio, images, and video on the club webpage as website multimedia elements.',
        'Add one safe-use rule: verify student consent and privacy settings before publishing photos or clips.',
      ],
    },
    quickCheck: [
      {
        id: 't4-s1c-q1',
        prompt: 'Which category best describes a platform built primarily for posting brief, real-time status updates and short announcements?',
        options: ['Microblogging', 'Offline spreadsheet', 'Database indexing', 'Disk defragmentation'],
        correctIndex: 0,
        rationale: 'Microblogging platforms focus on concise, frequent status posts rather than long articles or full media hosting.',
        leak: 'THEORY_RECALL',
      },
      {
        id: 't4-s1c-q2',
        prompt: 'Which combination represents valid website multimedia elements?',
        options: [
          'Audio clips, animation, video, graphics, and text',
          'RAM modules and power supply units',
          'Folder paths and Recycle Bin icons',
          'Ethernet crimpers and patch panels',
        ],
        correctIndex: 0,
        rationale: 'Website multimedia combines text, graphics, audio, video, and animation within web content.',
        leak: 'THEORY_RECALL',
      },
      {
        id: 't4-s1c-q3',
        prompt: 'Correct this false statement: "All social media platforms exist only for video sharing."',
        options: [
          'True, only video exists online',
          'False; platforms serve distinct purposes including profile networking, microblogging, photo sharing, and video sharing',
          'False; social media works only via USB cables',
          'True, because text cannot appear on websites',
        ],
        correctIndex: 1,
        rationale: 'Different social platforms specialise in networking, microblogging, photo curation, or video streaming.',
        leak: 'INSTRUCTION_CONTROL',
      },
    ],
    evidenceTask: {
      prompt: 'Classify four platform scenarios (networking, microblogging, photo sharing, video sharing) and explain two safe-use rules for campus multimedia.',
      deliverables: [
        'Platform-purpose classification with false-statement correction',
        'Website multimedia checklist + safe-use explanation',
      ],
      checklist: [
        { id: 't4-1c-chk1', label: 'Distinguished social networking, microblogging, photo sharing, and video sharing' },
        { id: 't4-1c-chk2', label: 'Named at least three website multimedia elements accurately' },
        { id: 't4-1c-chk3', label: 'Stated concrete privacy/consent safeguards for publishing online media' },
      ],
    },
  },
  {
    id: 'topic4-section2a',
    sectionCode: '2A',
    releaseScope: 'wave1',
    category: 'services',
    title: 'Internet Service Technologies',
    leakCode: 'THEORY_RECALL',
    nextAction: 'Map user goals (security, hosting, domain name, SEO, CMS, database) to the exact Internet service technology.',
    concept: {
      summary:
        'Internet service technologies are the underlying protocols, hosting services, and management tools that let websites and online systems be registered, built, stored, discovered, secured, and maintained.',
      keyPoints: [
        'HTTP transfers web pages between a web server and browser; HTTPS encrypts that communication so logins and card payments stay protected.',
        'Domain Registration reserves a unique human-readable web address (e.g. sankofa.co.za); Web Hosting provides server storage so the site is reachable 24/7 online.',
        'Content Management Systems (CMS) let editors update page text and images easily; Database Management stores structured records like logins, stock, and orders.',
        'SEO (Search Engine Optimisation) improves visibility in search results, while Email Services and Internet Marketing manage client communication and promotion.',
      ],
    },
    cbtTip:
      'Exam trap: Do not confuse Domain Registration (the address name) with Web Hosting (the server space storing site files), or HTTP with encrypted HTTPS.',
    triggerTable: [
      {
        contrast: 'HTTP vs HTTPS',
        rule: 'HTTP sends unencrypted web pages; HTTPS adds encryption for secure logins, banking, and checkout pages.',
      },
      {
        contrast: 'Domain Registration vs Web Hosting',
        rule: 'Domain registration buys the site name/address; Web hosting rents server space to store and serve the site files.',
      },
      {
        contrast: 'CMS vs Database Management',
        rule: 'CMS simplifies publishing and updating web content; Database management stores structured user accounts and transactions.',
      },
      {
        contrast: 'SEO vs Internet Marketing',
        rule: 'SEO improves organic search engine ranking; Internet marketing promotes products/services across online channels.',
      },
    ],
    guidedPractice: {
      title: 'Service-Role Diagnosis Drill',
      scenario:
        'A campus bookstore launches an online shop: it needs a memorable web address, server storage for files, encrypted checkout, product/order record storage, and higher Google visibility.',
      steps: [
        'Match buying the memorable web address to Domain Registration and storing the site files to Web Hosting.',
        'Match protecting the payment checkout page to HTTPS encryption.',
        'Match storing product catalogue items and customer orders to Database Management.',
        'Match improving Google search visibility to Search Engine Optimisation (SEO).',
      ],
    },
    quickCheck: [
      {
        id: 't4-s2a-q1',
        prompt: 'An online shop must protect customer passwords and card numbers on its checkout page. Which protocol/technology is essential?',
        options: ['HTTPS', 'Plain HTTP only', 'Disk cleanup', 'Print Preview'],
        correctIndex: 0,
        rationale: 'HTTPS encrypts data exchanged between the user browser and web server, protecting sensitive credentials and payments.',
        leak: 'THEORY_RECALL',
      },
      {
        id: 't4-s2a-q2',
        prompt: 'A new business has reserved its ".co.za" web address, but visitors still cannot view the site because no server stores its HTML and image files. Which service is missing?',
        options: ['Web hosting', 'Mail merge', 'Absolute cell referencing', 'Page Break Preview'],
        correctIndex: 0,
        rationale: 'Domain registration secures the address name, while web hosting provides the server storage and bandwidth to publish the files.',
        leak: 'THEORY_RECALL',
      },
      {
        id: 't4-s2a-q3',
        prompt: 'A school wants parents searching on Google to find its admissions page near the top of search results. Which service directly targets this goal?',
        options: ['Search Engine Optimisation (SEO)', 'BIOS flashing', 'Recycle Bin restoration', 'Font bolding'],
        correctIndex: 0,
        rationale: 'SEO improves website structure, keywords, and relevance so search engines rank the page higher.',
        leak: 'INSTRUCTION_CONTROL',
      },
    ],
    evidenceTask: {
      prompt: 'Produce a service-role table matching Domain Registration, Web Hosting, HTTPS, CMS, Database Management, and SEO to concrete scenario needs.',
      deliverables: [
        '6-row Internet service technology table',
        'Four worked scenario responses stating service name + marker keyword reason',
      ],
      checklist: [
        { id: 't4-2a-chk1', label: 'Separated Domain Registration from Web Hosting clearly' },
        { id: 't4-2a-chk2', label: 'Explained why HTTPS is mandatory for logins and checkout security' },
        { id: 't4-2a-chk3', label: 'Distinguished CMS content updates from Database record storage and SEO' },
      ],
    },
  },
  {
    id: 'topic4-section2b',
    sectionCode: '2B',
    releaseScope: 'wave1',
    category: 'services',
    title: 'Website Types: Static and Dynamic',
    leakCode: 'INSTRUCTION_CONTROL',
    nextAction: 'Spot whether content is fixed/manual or user-responsive/database-driven before classifying Static vs Dynamic.',
    concept: {
      summary:
        'Websites can be classified by their purpose (brochure, portal, e-commerce, news, blog, portfolio) and their technical behaviour as either Static or Dynamic.',
      keyPoints: [
        'A Static Website displays fixed content: every visitor sees the exact same page until an author manually edits and re-uploads the HTML file.',
        'A Dynamic Website generates or updates content automatically based on user input, login identity, database queries, or live feeds.',
        'Clues for Dynamic sites include user logins, personalised dashboards, live news updates, search filters, shopping carts, and comment feeds.',
        'Clues for Static sites include fixed contact pages, opening hours, or unchanging company brochure pages.',
      ],
    },
    cbtTip:
      'Exam trap: Do not guess Static vs Dynamic from whether a site has pictures—check whether pages stay identical for everyone until manually edited (Static) or respond/update from data and user actions (Dynamic).',
    triggerTable: [
      {
        contrast: 'Static Website vs Dynamic Website',
        rule: 'Static = fixed content changed only manually; Dynamic = interactive content generated or updated via databases/user actions.',
      },
      {
        contrast: 'Brochure Site vs Student Portal',
        rule: 'A brochure site showing hours and address is Static; a student portal with login and live marks is Dynamic.',
      },
      {
        contrast: 'Portfolio Showcase vs Online Newspaper',
        rule: 'A fixed designer gallery updated occasionally is Static; a news portal publishing breaking stories continuously is Dynamic.',
      },
      {
        contrast: 'Name Only vs Feature Justification',
        rule: 'Always state: [Website Type + Static/Dynamic] + [Precise interactive or fixed clue].',
      },
    ],
    guidedPractice: {
      title: 'Static vs Dynamic Behaviour Test',
      scenario:
        'Classify: (1) a local bakery site showing only its address and menu PDF, and (2) a TVET student portal where learners log in to view personal attendance and submit quizzes.',
      steps: [
        'Inspect the bakery site: content is identical for every visitor and changes only when manually edited -> Static informational/brochure site.',
        'Inspect the student portal: requires login, reads personal records from a database, and stores quiz submissions -> Dynamic educational portal.',
        'State the precise feature proving each choice instead of writing "static" or "dynamic" alone.',
        'Verify both explanations avoid confusing visual design with dynamic server behaviour.',
      ],
    },
    quickCheck: [
      {
        id: 't4-s2b-q1',
        prompt: 'A neighbourhood bakery website displays only its fixed street address, phone number, and opening hours until the owner manually edits the file. What type of website is this?',
        options: ['Static website', 'Dynamic real-time portal', 'Cloud database engine', 'Search engine crawler'],
        correctIndex: 0,
        rationale: 'Pages with fixed content that stay identical until manually edited are static websites.',
        leak: 'INSTRUCTION_CONTROL',
      },
      {
        id: 't4-s2b-q2',
        prompt: 'A college portal allows each learner to sign in, see personalised test marks from a database, and update contact details. Why is this a dynamic website?',
        options: [
          'Because it uses a green font colour',
          'Because it responds to user login/input and pulls personalised, changing data from a database',
          'Because it has fewer than three pages',
          'Because it cannot open on a laptop',
        ],
        correctIndex: 1,
        rationale: 'Dynamic websites respond to user input and display personalised or database-driven content.',
        leak: 'INSTRUCTION_CONTROL',
      },
      {
        id: 't4-s2b-q3',
        prompt: 'Which site is most likely a Dynamic website?',
        options: [
          'An online store with live stock counts, user accounts, and a shopping cart',
          'A single-page poster listing an annual event date',
          'A static PDF timetable uploaded once a year',
          'A plain offline HTML file with opening times',
        ],
        correctIndex: 0,
        rationale: 'Live inventory, accounts, and shopping carts require dynamic database interaction.',
        leak: 'THEORY_RECALL',
      },
    ],
    evidenceTask: {
      prompt: 'Classify four websites (online newspaper, travel blog, company brochure, student quiz portal) as Static or Dynamic with one precise proving clue each.',
      deliverables: [
        '4-row Static vs Dynamic classification table',
        'One corrected weak answer replacing visual claims with functional database/update clues',
      ],
      checklist: [
        { id: 't4-2b-chk1', label: 'Defined Static vs Dynamic accurately without relying on visual styling' },
        { id: 't4-2b-chk2', label: 'Matched brochure/fixed sites to Static and portals/carts to Dynamic' },
        { id: 't4-2b-chk3', label: 'Included a concrete behaviour clue in all four justifications' },
      ],
    },
  },
  {
    id: 'topic4-section2c',
    sectionCode: '2C',
    releaseScope: 'wave1',
    category: 'services',
    title: 'Location-Based, Mobile & E-Commerce Services',
    leakCode: 'INSTRUCTION_CONTROL',
    nextAction: 'Distinguish location-aware context, mobile responsive layout, and e-commerce transactions in scenarios.',
    concept: {
      summary:
        'Modern web services combine three distinct capabilities: Location-Based Services (using geographic position), Mobile Accessibility (usable layout on small screens), and E-Commerce (buying and selling online).',
      keyPoints: [
        'Location-Based Services (LBS) use GPS, Wi-Fi, or cellular location data to show nearby stores, delivery routes, or weather alerts.',
        'Mobile Accessibility / Responsive Design ensures websites adapt layout, font size, and tap controls automatically across phones, tablets, and desktops.',
        'E-Commerce enables electronic buying and selling via product catalogues, shopping carts, checkout workflows, and secure payment gateways (HTTPS).',
        'One scenario can combine multiple concepts—read carefully to identify every concept requested by the mark allocation.',
      ],
    },
    cbtTip:
      'Exam trap: Do not label a responsive layout change as "location-based service"—screen adaptation is Mobile Accessibility, whereas using GPS/place is Location-Based.',
    triggerTable: [
      {
        contrast: 'Location-Based Service vs Mobile Accessibility',
        rule: 'Location-Based uses user coordinates/place for relevant results; Mobile Accessibility adapts UI layout and readability to small screens.',
      },
      {
        contrast: 'Mobile Accessibility vs E-Commerce',
        rule: 'Mobile Accessibility ensures usable display on phones/tablets; E-Commerce handles product selection, carts, and online payment.',
      },
      {
        contrast: 'Static Brochure vs E-Commerce Store',
        rule: 'A brochure only advertises goods; an E-Commerce store completes cart, checkout, and payment online.',
      },
      {
        contrast: 'Single Concept vs Combined Scenario',
        rule: 'If a customer orders food on a phone to their GPS address, cite Mobile/Location AND E-Commerce with clues.',
      },
    ],
    guidedPractice: {
      title: 'Mobile & E-Commerce Scenario Split',
      scenario:
        'A customer opens a clothing site on a smartphone, notices the multi-column desktop grid automatically stacks into a clean single-column mobile menu, finds the nearest branch using GPS, and pays via card.',
      steps: [
        'Identify the screen layout adapting from laptop to smartphone -> Mobile Accessibility / Responsive Design.',
        'Identify finding the nearest physical branch via GPS -> Location-Based Service.',
        'Identify selecting items and paying by card online -> E-Commerce.',
        'Verify checkout security relies on HTTPS encryption.',
      ],
    },
    quickCheck: [
      {
        id: 't4-s2c-q1',
        prompt: 'A retail website automatically rearranges its menus and buttons so shoppers can read and tap easily on a small smartphone screen. Which concept is demonstrated?',
        options: ['Mobile accessibility', 'Static HTML archiving', 'Local area cabling', 'Mail merge filtering'],
        correctIndex: 0,
        rationale: 'Mobile accessibility ensures websites adjust cleanly and remain usable on smartphones and tablets.',
        leak: 'INSTRUCTION_CONTROL',
      },
      {
        id: 't4-s2c-q2',
        prompt: 'A food delivery app detects the user’s GPS coordinates to list only restaurants within 5 km. Which service is this?',
        options: [
          'Location-based service',
          'Text formatting',
          'Offline batch printing',
          'Peer-to-peer cabling',
        ],
        correctIndex: 0,
        rationale: 'Using geographic location data to deliver place-relevant results defines a location-based service.',
        leak: 'THEORY_RECALL',
      },
      {
        id: 't4-s2c-q3',
        prompt: 'Which three components typically confirm that a site supports E-Commerce rather than only online advertising?',
        options: [
          'Product catalogue, shopping cart, and online payment/checkout',
          'Margins, headers, and footers',
          'Switches, routers, and modems',
          'Bookmarks, folders, and ZIP archives',
        ],
        correctIndex: 0,
        rationale: 'E-commerce enables actual buying and selling using catalogues, carts, and electronic payment facilities.',
        leak: 'INSTRUCTION_CONTROL',
      },
    ],
    evidenceTask: {
      prompt: 'Analyse two mobile/e-commerce scenarios separating Location-Based, Mobile Accessibility, and E-Commerce features with supporting clues.',
      deliverables: [
        '3-concept scenario breakdown table',
        'Short security note linking mobile checkout to HTTPS',
      ],
      checklist: [
        { id: 't4-2c-chk1', label: 'Separated Location-Based Services from Mobile Accessibility accurately' },
        { id: 't4-2c-chk2', label: 'Identified E-Commerce components (catalogue, cart, payment)' },
        { id: 't4-2c-chk3', label: 'Quoted exact scenario clues for each concept named' },
      ],
    },
  },
  {
    id: 'topic4-section3a',
    sectionCode: '3A',
    releaseScope: 'wave1',
    category: 'search',
    title: 'Sources of Information on the Internet',
    leakCode: 'VERIFICATION_DISCIPLINE',
    nextAction: 'Evaluate web information sources (portals, encyclopaedias, news, blogs, forums) for reliability and fit.',
    concept: {
      summary:
        'Not every page returned by a search engine carries equal credibility. Learners must match the information task to trustworthy Internet sources and judge reliability before citing or reusing content.',
      keyPoints: [
        'Official institutional/government sites (.gov, .edu, .ac) and peer-reviewed or academic portals provide verified primary data and formal research.',
        'Online encyclopaedias offer quick background overviews, while reputable news portals report current events with editorial standards.',
        'Blogs and community forums reflect personal opinions or informal troubleshooting—useful for ideas, but weak as sole academic evidence.',
        'Verification discipline requires cross-checking claims across independent authoritative sources before relying on them.',
      ],
    },
    cbtTip:
      'Exam trap: Never recommend an unverified personal blog or anonymous forum post as authoritative proof for academic or official policy facts.',
    triggerTable: [
      {
        contrast: 'Official / Academic Portal vs Personal Blog',
        rule: 'Official/academic portals undergo institutional review; personal blogs reflect individual opinion and require corroboration.',
      },
      {
        contrast: 'Online Encyclopaedia vs Primary Government Source',
        rule: 'Encyclopaedias summarise general background; government/official portals hold authoritative regulations and statistics.',
      },
      {
        contrast: 'Single Forum Answer vs Cross-Checked Sources',
        rule: 'Verify critical facts across at least two reputable, independent sources before citing.',
      },
      {
        contrast: 'Useful for Ideas vs Reliable as Evidence',
        rule: 'Match source authority to the task stakes (formal assignment vs informal opinion).',
      },
    ],
    guidedPractice: {
      title: 'Source Reliability Triage',
      scenario:
        'A student researching national TVET exam dates finds (1) an anonymous forum comment, (2) a personal blog post from 2019, and (3) the official Department of Higher Education notice PDF.',
      steps: [
        'Reject the anonymous forum comment as unverified hearsay.',
        'Flag the 2019 blog post as both personal opinion and outdated.',
        'Select the official Department notice as the authoritative primary source.',
        'Record the publication date and URL for citation.',
      ],
    },
    quickCheck: [
      {
        id: 't4-s3a-q1',
        prompt: 'A student needs official national college registration rules for an assignment. Which Internet source is most reliable?',
        options: [
          'The official education department or college (.gov / .ac) portal',
          'An anonymous comment on a gaming forum',
          'An undated meme image on social media',
          'A personal travel blog',
        ],
        correctIndex: 0,
        rationale: 'Official institutional and government portals carry primary authority and editorial accountability.',
        leak: 'VERIFICATION_DISCIPLINE',
      },
      {
        id: 't4-s3a-q2',
        prompt: 'How should personal blogs and discussion forums be treated when researching factual coursework?',
        options: [
          'As infallible primary legislation',
          'As informal perspectives that must be cross-checked against authoritative sources',
          'As automatically copyrighted only to the reader',
          'As equivalent to peer-reviewed journals',
        ],
        correctIndex: 1,
        rationale: 'Blogs and forums reflect personal views and vary in accuracy, so facts must be verified elsewhere.',
        leak: 'VERIFICATION_DISCIPLINE',
      },
      {
        id: 't4-s3a-q3',
        prompt: 'Which check best protects reliability when two websites disagree on a statistic?',
        options: [
          'Pick whichever website has brighter colours',
          'Verify against an official primary statistical agency or published dataset',
          'Choose the shorter webpage',
          'Delete the search history',
        ],
        correctIndex: 1,
        rationale: 'Cross-checking against a primary authoritative dataset resolves conflicting secondary claims.',
        leak: 'VERIFICATION_DISCIPLINE',
      },
    ],
    evidenceTask: {
      prompt: 'Evaluate three sample Internet sources (official portal, news article, personal forum) and justify which fits a formal college report.',
      deliverables: [
        'Source reliability comparison table',
        'Short justification explaining why cross-checking is required',
      ],
      checklist: [
        { id: 't4-3a-chk1', label: 'Ranked official/academic sources above informal blogs and forums for factual proof' },
        { id: 't4-3a-chk2', label: 'Explained the difference between background overviews and primary evidence' },
        { id: 't4-3a-chk3', label: 'Included cross-checking across independent sources as a verification rule' },
      ],
    },
  },
  {
    id: 'topic4-section3b',
    sectionCode: '3B',
    releaseScope: 'wave1',
    category: 'search',
    title: 'Search Queries and Website Evaluation',
    leakCode: 'VERIFICATION_DISCIPLINE',
    nextAction: 'Construct Boolean/exact-phrase queries, evaluate sites on 4 criteria, and avoid plagiarism.',
    concept: {
      summary:
        'Effective web research requires choosing the right search query type and operators to filter noise, evaluating results on four core quality criteria, and rewriting findings in your own words with citations.',
      keyPoints: [
        'Query types: Navigational (find a specific site/login), Informational (learn about a topic), and Transactional (complete an action such as downloading or buying).',
        'Search operators: Quotation marks ("website multimedia") match exact phrases; AND requires both terms; OR broadens to either term; minus (-) excludes unwanted words.',
        'Website Evaluation Criteria (4 pillars): Authority (who published it & credentials), Accuracy (evidence & correctness), Objectivity (bias vs balanced facts), Currency (publication/update date).',
        'Plagiarism & Copyright: Copying website text word-for-word without acknowledgement breaks ethics and copyright rules—read, paraphrase in your own words, and reference the source.',
      ],
    },
    cbtTip:
      'Exam trap: Do not confuse AND (narrows results by requiring both terms) with OR (broadens results to match either term), and always evaluate all 4 pillars (Authority, Accuracy, Objectivity, Currency).',
    triggerTable: [
      {
        contrast: 'Exact Phrase "..." vs Unquoted Words',
        rule: 'Quotation marks ("website multimedia") require the exact words in that exact order; unquoted words match anywhere on the page.',
      },
      {
        contrast: 'AND vs OR vs Minus (-)',
        rule: 'AND narrows (both terms required); OR widens (either term matches); -term excludes irrelevant meanings.',
      },
      {
        contrast: 'Authority vs Objectivity vs Currency',
        rule: 'Authority = credible author/org; Objectivity = neutral/unbiased purpose; Currency = recent update date.',
      },
      {
        contrast: 'Copy-Paste vs Paraphrase + Cite',
        rule: 'Pasting uncredited text is plagiarism; rewrite ideas in your own words and cite the source.',
      },
    ],
    guidedPractice: {
      title: 'Precision Search & Website Audit',
      scenario:
        'You must research e-commerce shopping carts and website multimedia, exclude gaming blogs, evaluate a 2014 advertorial page, and summarise findings ethically.',
      steps: [
        'Write an exact-phrase query: "website multimedia" and a combined query: "e-commerce" AND "shopping cart" -gaming.',
        'Check Currency and Objectivity on the 2014 advertorial: flag it as outdated (Currency) and biased toward selling a product (Objectivity).',
        'Locate a current educational or standards source with clear author credentials (Authority) and cited facts (Accuracy).',
        'Summarise the findings in your own words and add the source title and URL to avoid plagiarism.',
      ],
    },
    quickCheck: [
      {
        id: 't4-s3b-q1',
        prompt: 'Which search query finds pages containing the exact phrase website multimedia?',
        options: [
          '"website multimedia"',
          'website OR multimedia',
          'website -multimedia',
          'website +OR+ multimedia',
        ],
        correctIndex: 0,
        rationale: 'Double quotation marks instruct the search engine to match the exact words in that exact sequence.',
        leak: 'VERIFICATION_DISCIPLINE',
      },
      {
        id: 't4-s3b-q2',
        prompt: 'A webpage has no named author, uses exaggerated sales claims to push one product, and was last updated in 2012. Which evaluation criteria fail?',
        options: [
          'Authority, Objectivity, and Currency',
          'Only font size and margin width',
          'Only LAN coverage',
          'Only RAM speed',
        ],
        correctIndex: 0,
        rationale: 'Missing author = weak Authority; one-sided sales promotion = weak Objectivity; 2012 date = poor Currency.',
        leak: 'VERIFICATION_DISCIPLINE',
      },
      {
        id: 't4-s3b-q3',
        prompt: 'Which practice avoids plagiarism when using information found on a website?',
        options: [
          'Copy and paste two paragraphs without quotation marks or citations',
          'Read, understand, rewrite in your own words, and acknowledge the source',
          'Change only the font colour of copied text',
          'Remove the author name from the bibliography',
        ],
        correctIndex: 1,
        rationale: 'Paraphrasing in your own words and crediting the original source prevents plagiarism and respects copyright.',
        leak: 'INSTRUCTION_CONTROL',
      },
    ],
    evidenceTask: {
      prompt: 'Write three Boolean/exact-phrase queries (exact phrase, AND, OR), evaluate one website on all 4 pillars, and record one anti-plagiarism rule.',
      deliverables: [
        '3 valid search operator queries',
        '4-pillar evaluation paragraph + plagiarism prevention statement',
      ],
      checklist: [
        { id: 't4-3b-chk1', label: 'Constructed valid exact-phrase ("..."), AND, and OR search queries' },
        { id: 't4-3b-chk2', label: 'Evaluated a sample site across Authority, Accuracy, Objectivity, and Currency' },
        { id: 't4-3b-chk3', label: 'Explained paraphrasing plus citation to prevent plagiarism' },
      ],
    },
  },
  {
    id: 'topic4-section4',
    sectionCode: '4',
    releaseScope: 'wave2',
    category: 'consolidation',
    title: 'Topic 4 Consolidation & Revision Map',
    leakCode: 'INSTRUCTION_CONTROL',
    nextAction: 'Link blocks 4.1 (Apps), 4.2 (Services & Websites), and 4.3 (Search & Evaluation) into one revision map.',
    concept: {
      summary:
        'Section 4 brings all Topic 4 concepts together so learners connect definitions, scenario clues, and verification rules across 4.1 Internet Applications, 4.2 Internet Service Technologies, and 4.3 Searching & Website Evaluation.',
      keyPoints: [
        'Block 4.1 (Apps & Web): Plug-ins extend browsers; Web 1.0 (static) -> 2.0 (social) -> 3.0 (semantic) -> 4.0 (intelligent); platforms serve distinct networking, microblogging, photo, and video roles.',
        'Block 4.2 (Services & Sites): Domain vs Hosting, HTTP vs HTTPS, Static vs Dynamic websites, Location-Based vs Mobile Accessibility vs E-Commerce.',
        'Block 4.3 (Search & Evaluation): Exact phrase & Boolean operators (AND/OR/-), source authority, 4 website evaluation criteria, and plagiarism avoidance.',
        'Every exam answer must follow the 3-step method: Clue -> Concept -> Reason using textbook keywords.',
      ],
    },
    cbtTip:
      'Exam trap: Do not mix up blocks when revising—a question about secure checkout belongs to HTTPS / E-Commerce (4.2), while a question about finding credible pages belongs to Search Queries & Website Evaluation (4.3).',
    triggerTable: [
      {
        contrast: 'HTTP vs HTTPS',
        rule: 'HTTP transfers standard pages; HTTPS encrypts sensitive login and payment traffic.',
      },
      {
        contrast: 'Static Brochure vs Dynamic Portal',
        rule: 'Static content changes only when manually edited; dynamic sites respond to logins, forms, and databases.',
      },
      {
        contrast: 'AND vs OR in Queries',
        rule: 'AND narrows results (all words required); OR broadens results (either word accepted).',
      },
      {
        contrast: 'Label-Only vs Reasoned Answer',
        rule: 'Never stop at an acronym or single word unless the mark is 1 mark for naming only.',
      },
    ],
    guidedPractice: {
      title: 'Topic 4 Cross-Block Revision Map',
      scenario:
        'Map three mixed exam prompts: (1) adding PDF editing to a workflow, (2) checking why a checkout page shows a padlock, and (3) filtering search results excluding advertisements.',
      steps: [
        'Link prompt 1 to Block 4.1 (Internet applications / PDF converter plug-in) and name the task action.',
        'Link prompt 2 to Block 4.2 (HTTPS encryption under Internet service technologies / E-Commerce).',
        'Link prompt 3 to Block 4.3 (Boolean minus `-` operator and Objectivity check).',
        'Verify each response includes Clue + Concept + Reason.',
      ],
    },
    quickCheck: [
      {
        id: 't4-s4-q1',
        prompt: 'Which revision pair correctly matches two Topic 4 concepts to their blocks?',
        options: [
          'Web 1.0–4.0 = Block 4.1; HTTPS & Web Hosting = Block 4.2',
          'Boolean AND = Block 4.1; Flash Player = Block 4.3',
          'Static websites = Block 4.3; Plagiarism = Block 4.2',
          'Microblogging = Block 4.2; SEO = Block 4.1',
        ],
        correctIndex: 0,
        rationale: 'Web evolution sits in 4.1 (Internet applications/web services), while HTTPS and hosting sit in 4.2 (service technologies).',
        leak: 'INSTRUCTION_CONTROL',
      },
      {
        id: 't4-s4-q2',
        prompt: 'Which operator narrows a web search by excluding results containing the word "forum"?',
        options: ['-forum', 'OR forum', '"forum"', 'HTTPS forum'],
        correctIndex: 0,
        rationale: 'The minus (-) operator excludes pages containing the specified term.',
        leak: 'VERIFICATION_DISCIPLINE',
      },
      {
        id: 't4-s4-q3',
        prompt: 'Why does a consolidation revision map pair every keyword with a "common wrong answer"?',
        options: [
          'To spotlight traps (like confusing HTTP/HTTPS or Static/Dynamic) before timed exams',
          'To double the word count without learning',
          'To skip website evaluation checks',
          'To avoid writing explanations',
        ],
        correctIndex: 0,
        rationale: 'Contrasting correct triggers against frequent misconceptions prevents repeat mark leaks.',
        leak: 'TIME_DISCIPLINE',
      },
    ],
    evidenceTask: {
      prompt: 'Complete a Topic 4 revision map linking one keyword, scenario clue, wrong trap, and correction rule for each block (4.1, 4.2, 4.3).',
      deliverables: [
        'Topic 4 revision map across Blocks 4.1, 4.2, and 4.3',
        '3 corrected misconception notes',
      ],
      checklist: [
        { id: 't4-4-chk1', label: 'Covered all three Topic 4 syllabus blocks (4.1, 4.2, 4.3)' },
        { id: 't4-4-chk2', label: 'Paired each high-risk term with its scenario clue and distractor trap' },
        { id: 't4-4-chk3', label: 'Verified all explanations include Clue + Concept + Reason' },
      ],
    },
  },
  {
    id: 'topic4-mastery',
    sectionCode: 'Mastery',
    releaseScope: 'wave2',
    category: 'consolidation',
    title: 'Internet & Communication Mastery (150 Marks)',
    leakCode: 'TIME_DISCIPLINE',
    nextAction: 'Demonstrate 150-mark Topic 4 exam readiness across theory, service scenarios, and search evaluation.',
    concept: {
      summary:
        'The Topic 4 Mastery module simulates integrated 150-mark readiness across syllabus blocks 4.1, 4.2, and 4.3—testing definitions, scenario classification, Boolean query design, website evaluation, and leak recovery.',
      keyPoints: [
        'Part A (50 marks): Core terminology & concepts—plug-ins, Web 1.0–4.0, social/multimedia categories, HTTP/HTTPS, domain/hosting, SEO.',
        'Part B (50 marks): Scenario classification & justification—Static vs Dynamic, Location-Based vs Mobile Accessibility vs E-Commerce.',
        'Part C (50 marks): Information retrieval & verification—Boolean/phrase search queries, 4 website evaluation criteria, and anti-plagiarism practice.',
        'Time discipline: Read the mark allocation, spot the clue, name the concept, and justify with exact textbook keywords.',
      ],
    },
    cbtTip:
      'Exam trap: Under timed 150-mark pressure, rushing causes students to answer only with an acronym (losing half the marks) or omit one evaluation criterion—check mark counts before moving on.',
    triggerTable: [
      {
        contrast: '1-Mark Name Prompt vs 3-Mark Explain Prompt',
        rule: 'A 1-mark prompt asks for the term; a 2–4 mark prompt requires Concept + Scenario Clue + Functional Reason.',
      },
      {
        contrast: 'Search Query Syntax vs Website Evaluation',
        rule: 'Query operators control what results appear; Authority/Accuracy/Objectivity/Currency judge whether those results are trustworthy.',
      },
      {
        contrast: 'Technical Service vs User Benefit',
        rule: 'Name the service (e.g. HTTPS, CMS, SEO) and link it directly to the business/user benefit asked.',
      },
      {
        contrast: 'Unverified Draft vs Final Mastery Check',
        rule: 'Re-read every multi-mark answer to confirm no acronym stands alone without justification.',
      },
    ],
    guidedPractice: {
      title: '150-Mark Topic 4 Readiness Simulation',
      scenario:
        'A training institute redesigns its website to support mobile applicants, encrypted online fee payments, live course search, and credible research guides.',
      steps: [
        'Part A check: Name HTTPS for secure fee payments and CMS/Database for dynamic course updates.',
        'Part B check: Classify the portal as Dynamic and cite Mobile Accessibility for phone layout adaptation.',
        'Part C check: Write an exact-phrase + Boolean query for research guides and verify sources via Authority, Accuracy, Objectivity, and Currency.',
        'Final audit: Confirm all answers include Clue + Concept + Reason and log any recurring leak category.',
      ],
    },
    quickCheck: [
      {
        id: 't4-m-q1',
        prompt: 'In a 4-mark Topic 4 scenario question asking you to classify a website and justify your answer, which structure secures full marks?',
        options: [
          'Writing only "Dynamic"',
          'Classifying Static or Dynamic, quoting the interaction/database clue, and explaining why that feature proves the classification',
          'Listing unrelated plug-ins',
          'Writing one broad word like "Internet"',
        ],
        correctIndex: 1,
        rationale: 'Multi-mark Topic 4 questions reward exact classification backed by the scenario clue and clear reasoning.',
        leak: 'TIME_DISCIPLINE',
      },
      {
        id: 't4-m-q2',
        prompt: 'Which combination addresses BOTH mobile usability and safe financial transactions on a retail portal?',
        options: [
          'Mobile accessibility (responsive layout) + HTTPS encryption',
          'Web 1.0 static HTML + plain HTTP',
          'Microblogging + unverified forums',
          'Copy-paste text + manual page breaks',
        ],
        correctIndex: 0,
        rationale: 'Mobile accessibility keeps small-screen navigation usable while HTTPS secures payment and login data.',
        leak: 'INSTRUCTION_CONTROL',
      },
      {
        id: 't4-m-q3',
        prompt: 'After crafting `"digital citizenship" AND "N5"`, which step ensures the returned source is credible before citing it?',
        options: [
          'Evaluate Authority, Accuracy, Objectivity, and Currency, then paraphrase with citation',
          'Copy the first paragraph verbatim without checking the date',
          'Trust any page with pop-up ads',
          'Skip checking who owns the domain',
        ],
        correctIndex: 0,
        rationale: 'Search queries find pages, while the 4 evaluation criteria plus paraphrasing/citation ensure trustworthy, ethical research.',
        leak: 'VERIFICATION_DISCIPLINE',
      },
    ],
    evidenceTask: {
      prompt: 'Record your 150-mark Topic 4 readiness check across Parts A, B, and C, identifying your strongest block and any leak rule to carry into N5 Gate assessments.',
      deliverables: [
        '150-mark Topic 4 readiness summary across 4.1, 4.2, and 4.3',
        'Leak correction plan noting any repeated errors',
      ],
      checklist: [
        { id: 't4-m-chk1', label: 'Verified readiness across 4.1 Apps/Web, 4.2 Services/Sites, and 4.3 Search/Evaluation' },
        { id: 't4-m-chk2', label: 'Applied the 3-step Clue -> Concept -> Reason method on scenario items' },
        { id: 't4-m-chk3', label: 'Recorded weakest Topic 4 skill and specific correction action' },
      ],
    },
  },
]
