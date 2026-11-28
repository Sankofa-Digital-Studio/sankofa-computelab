export const TOPIC5_TITLE = 'CPN5 Topic 5 · Digital Citizenship, Cybercrime & Ethics'

export const TOPIC5_MODULES = [
  {
    id: 'topic5-emerging-tech',
    sectionCode: '1A',
    releaseScope: 'wave1',
    category: 'emerging',
    title: 'Emerging Technology Scenario Control',
    leakCode: 'THEORY_EXPLANATION',
    nextAction: 'Connect emerging technologies to a real use case and concrete human impact (speed, safety, privacy, cost, or jobs).',
    concept: {
      summary:
        'Emerging technologies are new or rapidly developing digital tools—such as Artificial Intelligence (AI), smart sensors/IoT, cloud automation, and biometrics—that reshape how people live, work, learn, and receive healthcare.',
      keyPoints: [
        'Examiners do not reward buzzword definitions alone; connect the technology directly to a real-world role in the scenario.',
        'Always pair the technology with a human impact dimension: speed, access, safety, privacy, accuracy, cost, or employment.',
        'For example, AI medical imaging assists doctors by spotting disease patterns faster, while still requiring trained human oversight.',
        'Where two emerging technologies overlap, any valid syllabus answer earns credit when backed by the exact scenario clue.',
      ],
    },
    cbtTip:
      'Exam trap: Never write a one-line buzzword definition like "AI means smart computers"—state the technology, what it does in the scenario, and one concrete benefit plus one realistic risk.',
    triggerTable: [
      {
        contrast: 'Buzzword Definition vs Scenario Impact',
        rule: 'A buzzword names the tech only; an exam-ready answer adds the real-world use AND a human impact (benefit or risk).',
      },
      {
        contrast: 'AI Support vs Human Oversight',
        rule: 'AI analyses patterns rapidly to assist decisions, but critical fields (like medicine) still require professional human verification.',
      },
      {
        contrast: 'Efficiency Gain vs Privacy / Job Risk',
        rule: 'Automation and smart tech raise speed and convenience while introducing privacy, data-security, and role-shift concerns.',
      },
      {
        contrast: 'Vague Future Guess vs Syllabus Role',
        rule: 'Focus on what role the technology plays in society (health, transport, learning, work) using scenario evidence.',
      },
    ],
    guidedPractice: {
      title: 'Emerging-Tech Impact Ladder',
      scenario:
        'A regional hospital deploys AI diagnostic software to scan thousands of X-rays for early disease markers before specialists review flagged cases.',
      steps: [
        'Identify the emerging technology from the clue: Artificial Intelligence (AI) pattern-recognition software.',
        'State its functional role in the scenario: analysing medical scan images rapidly to highlight anomalies.',
        'Explain the human benefit: faster, earlier diagnosis and support for overburdened doctors.',
        'Add one realistic safeguard/risk: specialists must still verify AI findings and protect patient scan privacy.',
      ],
    },
    quickCheck: [
      {
        id: 't5-s1a-q1',
        prompt: 'A clinic uses software that learns from thousands of medical scans to flag early warning patterns for doctors. Which answer earns full marks?',
        options: [
          'Writing only "AI"',
          'Identifying AI pattern analysis, explaining faster early-diagnosis support, and noting that doctors must still supervise decisions',
          'Saying "computers are modern"',
          'Listing printer margin settings',
        ],
        correctIndex: 1,
        rationale: 'Full marks require naming the technology, linking it to the scenario function, and stating its real-world impact/safeguard.',
        leak: 'THEORY_EXPLANATION',
      },
      {
        id: 't5-s1a-q2',
        prompt: 'Which human-effect dimensions are most commonly tested in Topic 5 Emerging Technology scenarios?',
        options: [
          'Speed, access, safety, privacy, cost, and employment',
          'Only screen wallpaper colours',
          'Only cable lengths',
          'Only font serif styles',
        ],
        correctIndex: 0,
        rationale: 'Examiners expect answers connecting new technology to practical human effects such as speed, safety, privacy, cost, or jobs.',
        leak: 'THEORY_EXPLANATION',
      },
      {
        id: 't5-s1a-q3',
        prompt: 'Why can two learners name slightly different emerging technologies in an overlapping scenario and both earn credit?',
        options: [
          'Because marking accepts any random term',
          'Because credit follows accurate function and valid justification linked to the scenario clue',
          'Because emerging technologies have no definitions',
          'Because only word count is graded',
        ],
        correctIndex: 1,
        rationale: 'When technologies overlap, clear justification anchored to the scenario clue proves understanding.',
        leak: 'COMMUNICATION_THEORY',
      },
    ],
    evidenceTask: {
      prompt: 'Build an emerging-technology scenario table for three sectors (healthcare, transport/smart logistics, education) with benefit, risk, and best-fit use.',
      deliverables: [
        '3-row emerging-technology scenario table',
        'One corrected weak buzzword answer expanded with human impact',
      ],
      checklist: [
        { id: 't5-1a-chk1', label: 'Named concrete emerging technologies without relying on vague buzzwords' },
        { id: 't5-1a-chk2', label: 'Connected each technology to both a real scenario benefit and a realistic risk' },
        { id: 't5-1a-chk3', label: 'Quoted scenario clues in each justification' },
      ],
    },
  },
  {
    id: 'topic5-ict-impact',
    sectionCode: '1B',
    releaseScope: 'wave1',
    category: 'impact',
    title: 'ICT Impact and Human Decision Control',
    leakCode: 'COMMUNICATION_THEORY',
    nextAction: 'Evaluate how ICT transforms banking, work, education, and communication using the Reason + Example + Link frame.',
    concept: {
      summary:
        'ICT does more than supply hardware—it transforms how society communicates, learns, banks, works, governs, and makes decisions, creating major benefits alongside privacy, dependence, and inequality risks.',
      keyPoints: [
        'Communication & Education: Video conferencing and e-learning widen access across distances, though connectivity gaps can cause digital inequality.',
        'Banking & Daily Life: Mobile banking saves travel time and allows 24/7 bill payments, but users must guard passwords and spot phishing scams.',
        'Work & Employment: ICT automates repetitive tasks and creates new digital roles while requiring workers to reskill.',
        'Paragraph Craft (Reason + Example + Link): Move beyond fragments by stating what changes, giving a concrete example, and adding one benefit plus one risk.',
      ],
    },
    cbtTip:
      'Exam trap: Short 5-word fragments lose half the marks on "discuss" or "evaluate" prompts—always expand with Reason + Concrete Example + Benefit/Risk Link.',
    triggerTable: [
      {
        contrast: 'Short Fragment vs Exam-Ready Paragraph',
        rule: 'Fragment: "Banking is fast." Exam-ready: "Mobile banking lets users pay bills remotely (Reason), saving branch travel (Example), though users must protect logins against scams (Risk/Link)."',
      },
      {
        contrast: 'ICT Benefit vs Digital Inequality',
        rule: 'Online services expand access for connected users while excluding communities without affordable devices or data.',
      },
      {
        contrast: 'Video Conferencing Benefit vs Dependence Risk',
        rule: 'Remote meetings cut travel cost and connect teams globally, yet fail if connectivity or security controls break.',
      },
      {
        contrast: 'Job Replacement vs New Digital Roles',
        rule: 'ICT changes older clerical workflows while creating demand for support, data, and digital administration skills.',
      },
    ],
    guidedPractice: {
      title: 'Reason + Example + Link Paragraph Builder',
      scenario:
        'A small business switches from in-person branch visits and travel-heavy meetings to mobile banking and video conferencing.',
      steps: [
        'Name the impact areas: banking/finance and workplace communication.',
        'State the benefits with concrete examples: paying suppliers via mobile banking without queues and holding live video meetings across towns.',
        'Add the matching risks: phishing/password theft on mobile banking and unstable connectivity during video calls.',
        'Link to a responsible control: enforce strong authentication and verify payment requests before sending funds.',
      ],
    },
    quickCheck: [
      {
        id: 't5-s1b-q1',
        prompt: 'Which answer structure turns a weak 4-word fragment into a high-scoring ICT impact paragraph?',
        options: [
          'Reason + Concrete Example + Benefit/Risk Link',
          'Acronym + Blank Line',
          'Font Bold + Underline',
          'Single-word label only',
        ],
        correctIndex: 0,
        rationale: 'Combining a clear reason, concrete example, and balanced benefit/risk link demonstrates application and evaluation.',
        leak: 'COMMUNICATION_THEORY',
      },
      {
        id: 't5-s1b-q2',
        prompt: 'A rural clinic adopts online patient portals, saving travel for smartphone owners, while elderly patients without data struggle to book. Which risk is highlighted?',
        options: ['Digital inequality / access divide', 'Spreadsheet drift', 'Print scaling', 'Mail merge duplication'],
        correctIndex: 0,
        rationale: 'Unequal access to devices, connectivity, or digital skills creates digital inequality.',
        leak: 'COMMUNICATION_THEORY',
      },
      {
        id: 't5-s1b-q3',
        prompt: 'Mobile banking improves convenience by letting customers pay bills from anywhere. What essential risk & control should accompany this benefit in an exam answer?',
        options: [
          'Risk of scams/account compromise -> protect passwords, use MFA, and verify payment alerts',
          'Risk of paper jams -> buy thicker envelopes',
          'No risks exist online',
          'Share PINs openly with friends',
        ],
        correctIndex: 0,
        rationale: 'Evaluating mobile banking fairly includes convenience alongside credential protection against fraud.',
        leak: 'THEORY_EXPLANATION',
      },
    ],
    evidenceTask: {
      prompt: 'Write two ICT impact paragraphs (video conferencing and mobile banking) using Reason + Example + Benefit/Risk Link, plus one prevention recommendation.',
      deliverables: [
        'ICT impact comparison matrix',
        'Two structured paragraphs + one prevention recommendation',
      ],
      checklist: [
        { id: 't5-1b-chk1', label: 'Identified specific ICT impact areas (communication, banking, work, education)' },
        { id: 't5-1b-chk2', label: 'Used Reason + Concrete Example + Benefit/Risk Link in both paragraphs' },
        { id: 't5-1b-chk3', label: 'Included a realistic privacy, inequality, or security safeguard' },
      ],
    },
  },
  {
    id: 'topic5-human-impact-discussion',
    sectionCode: '1B Ext',
    releaseScope: 'wave1',
    category: 'impact',
    title: 'Human ICT Impact Debate Control',
    leakCode: 'COMMUNICATION_THEORY',
    nextAction: 'Turn one-sided opinions into balanced two-sided ICT arguments ending in a reasoned judgement.',
    concept: {
      summary:
        'Higher-order Topic 5 questions ask learners to debate how ICT affects the human race and society—requiring balanced arguments FOR and AGAINST a claim followed by a clear, evidence-backed judgement.',
      keyPoints: [
        'A debate prompt (e.g. "Should schools rely solely on e-learning?" or "Does mobile tech connect or distract families?") cannot be answered with "Yes, it is good."',
        'Present strong supporting points (speed, global reach, flexible learning, data consistency) alongside counterarguments (distraction, isolation, unequal access, over-reliance).',
        'Conclude with a balanced, practical judgement explaining how responsible rules or hybrid use capture benefits while reducing harm.',
        'Never invent fake statistics—ground points in realistic everyday digital experiences.',
      ],
    },
    cbtTip:
      'Exam trap: Giving only one side of a debate question caps your marks at half credit—always write For + Against + Defensible Judgement.',
    triggerTable: [
      {
        contrast: 'Opinion-Only Claim vs Balanced Debate',
        rule: 'Opinion: "Phones ruin families." Balanced: weighs instant family check-ins against screen distraction, then recommends device-free rules.',
      },
      {
        contrast: 'Computer Decisions vs Human Decisions',
        rule: 'Computers process massive data consistently without fatigue; humans contribute ethics, empathy, context, and final accountability.',
      },
      {
        contrast: 'Full Online Shift vs Hybrid Support',
        rule: 'E-learning offers flexible anytime revision, yet physical classrooms and offline access remain vital where bandwidth is scarce.',
      },
      {
        contrast: 'Summary Only vs Final Judgement',
        rule: 'End every debate answer with a "Therefore..." sentence stating your reasoned conclusion.',
      },
    ],
    guidedPractice: {
      title: 'Two-Sided Debate Frame',
      scenario:
        'Debate prompt: "Will computers eventually make better decisions than humans in every workplace?"',
      steps: [
        'For side: Computers analyse large datasets rapidly, spot statistical patterns, and avoid human calculation fatigue.',
        'Against side: Computers lack moral judgement, empathy, and accountability when unexpected human situations arise.',
        'Reconcile both sides: Algorithms support human decision-makers with accurate data rather than replacing ethical oversight.',
        'Write a final judgement sentence tying efficiency to responsible human governance.',
      ],
    },
    quickCheck: [
      {
        id: 't5-s1be-q1',
        prompt: 'What three parts must appear in a strong Topic 5 human-impact debate answer?',
        options: [
          'Supporting arguments (For), counterarguments (Against), and a balanced final judgement',
          'Only one personal opinion with exclamation marks',
          'Only three hardware acronyms',
          'A blank table with no conclusion',
        ],
        correctIndex: 0,
        rationale: 'Balanced higher-order arguments require both perspectives plus a defensible final judgement.',
        leak: 'COMMUNICATION_THEORY',
      },
      {
        id: 't5-s1be-q2',
        prompt: 'When debating whether mobile technology connects or distracts families, what makes the strongest final judgement?',
        options: [
          'Stating that mobile tech must be banned worldwide',
          'Concluding that it strengthens distant family communication when paired with healthy screen-time boundaries at home',
          'Saying smartphones have no battery',
          'Ignoring the distraction risk completely',
        ],
        correctIndex: 1,
        rationale: 'A strong judgement acknowledges both connection benefits and distraction risks, proposing balanced use.',
        leak: 'COMMUNICATION_THEORY',
      },
      {
        id: 't5-s1be-q3',
        prompt: 'Why should humans retain final accountability over automated computer decisions in sensitive areas like healthcare or hiring?',
        options: [
          'Because computers cannot exercise moral judgement, empathy, or contextual fairness alone',
          'Because computers cannot add numbers',
          'Because monitors do not display text',
          'Because keyboards cannot type decimals',
        ],
        correctIndex: 0,
        rationale: 'While computers excel at data processing, ethical accountability and context remain human responsibilities.',
        leak: 'THEORY_EXPLANATION',
      },
    ],
    evidenceTask: {
      prompt: 'Build a two-sided debate table and final judgement paragraph on "Should colleges rely more heavily on e-learning?"',
      deliverables: [
        'Two-sided debate table (Benefits vs Risks)',
        'Balanced judgement paragraph replacing an opinion-only answer',
      ],
      checklist: [
        { id: 't5-1be-chk1', label: 'Provided clear arguments both FOR and AGAINST the debate claim' },
        { id: 't5-1be-chk2', label: 'Included realistic human/social impacts rather than opinion slogans' },
        { id: 't5-1be-chk3', label: 'Ended with a clear, reasoned judgement sentence' },
      ],
    },
  },
  {
    id: 'topic5-cybercriminal-methods',
    sectionCode: '2A',
    releaseScope: 'wave1',
    category: 'cybercrime',
    title: 'Cybercriminal Methods Scenario Decoder',
    leakCode: 'THEORY_EXPLANATION',
    nextAction: 'Spot the digital action and target first, then separate hackers, crackers, cyber gangs, and virus authors.',
    concept: {
      summary:
        'Cybercrime is criminal activity using a computer, network, or the Internet to target people, data, money, or systems. Examiners test whether you can separate different threat actors by their actions and motives.',
      keyPoints: [
        'Detect the digital action first: access, steal, damage, threaten, deceive, or distribute malicious code—and note the target (person, account, file, or organisation).',
        'Hacker vs Cracker: In syllabus usage, hackers explore/test system weaknesses (and ethical/white-hat hackers help secure systems), whereas crackers break security intentionally for malicious gain or theft.',
        'Cyber Gangs: Organised criminal groups coordinating large-scale fraud, ransomware, or data breaches across networks.',
        'Virus / Malware Authors: Individuals or groups who specifically write and release self-replicating or damaging malicious programs.',
      ],
    },
    cbtTip:
      'Exam trap: Do not label every attacker a "virus author"—if the clue describes an organised group running international extortion, it points to a cyber gang; if someone writes malware code, it is a virus author.',
    triggerTable: [
      {
        contrast: 'Cracker vs Ethical (White-Hat) Hacker',
        rule: 'Crackers break security unlawfully for damage or theft; ethical hackers test weaknesses with permission to improve security.',
      },
      {
        contrast: 'Virus Author vs Cyber Gang',
        rule: 'A virus author creates malicious code; a cyber gang is an organised group running coordinated attacks or fraud.',
      },
      {
        contrast: 'Target Clue vs Action Clue',
        rule: 'Action = what they do (deceive, steal, encrypt, infect); Target = who/what is harmed (bank login, customer DB).',
      },
      {
        contrast: 'Broad Label vs Scenario Proof',
        rule: 'Always underline and quote the proving action word before naming the threat actor.',
      },
    ],
    guidedPractice: {
      title: 'Threat-Actor Action Decoder',
      scenario:
        'Classify two incidents: (A) an organised ring across three countries steals credit card lists and demands ransom; (B) a programmer codes a new worm designed to corrupt spreadsheets.',
      steps: [
        'Incident A action + scale: coordinated cross-border theft and extortion by an organised group -> Cyber gang.',
        'Incident B action: writing self-spreading damaging program code -> Virus/malware author.',
        'Quote the proving clue ("organised ring", "codes a new worm") in each answer.',
        'Pair each with one prevention control (network monitoring/MFA and updated antivirus + least privilege).',
      ],
    },
    quickCheck: [
      {
        id: 't5-s2a-q1',
        prompt: 'Which first step prevents confusing different cybercriminals in a scenario question?',
        options: [
          'Detect the digital action (e.g. writing code, breaking in, deceiving, coordinating) and the target before naming the actor',
          'Guess "hacker" for every single question',
          'Pick the longest option randomly',
          'Ignore who is targeted',
        ],
        correctIndex: 0,
        rationale: 'Identifying the exact action and target separates virus authors, crackers, ethical hackers, and cyber gangs.',
        leak: 'THEORY_EXPLANATION',
      },
      {
        id: 't5-s2a-q2',
        prompt: 'A programmer writes and releases malicious code designed specifically to infect USB drives and delete documents. Which term fits best?',
        options: ['Virus / malware author', 'Web designer', 'Ethical auditor', 'Database clerk'],
        correctIndex: 0,
        rationale: 'Creating and releasing damaging self-replicating code specifically defines a virus/malware author.',
        leak: 'THEORY_EXPLANATION',
      },
      {
        id: 't5-s2a-q3',
        prompt: 'How does an ethical (white-hat) security tester differ from a malicious cracker?',
        options: [
          'An ethical tester checks vulnerabilities with authorisation to fix security, whereas a cracker breaks in unlawfully to steal or damage',
          'An ethical tester never uses a computer',
          'A cracker works only offline on paper',
          'There is no difference in law or permission',
        ],
        correctIndex: 0,
        rationale: 'Authorisation and protective intent distinguish ethical security testing from unlawful cracking.',
        leak: 'COMMUNICATION_THEORY',
      },
    ],
    evidenceTask: {
      prompt: 'Create a 4-actor decoder table (Cracker, Ethical Hacker, Cyber Gang, Virus Author) with an action clue and prevention control for each.',
      deliverables: [
        'Cybercriminal classification decoder table',
        'Two scenario justifications quoting proving action clues',
      ],
      checklist: [
        { id: 't5-2a-chk1', label: 'Distinguished crackers, ethical hackers, cyber gangs, and virus authors by action' },
        { id: 't5-2a-chk2', label: 'Quoted exact action and target clues from scenarios' },
        { id: 't5-2a-chk3', label: 'Paired each threat actor with a relevant prevention method' },
      ],
    },
  },
  {
    id: 'topic5-cybercrime-types',
    sectionCode: '2B',
    releaseScope: 'wave1',
    category: 'cybercrime',
    title: 'Cybercrime Type Spotting Control',
    leakCode: 'THEORY_EXPLANATION',
    nextAction: 'Detect the crime action (impersonate, encrypt/lock, copy confidential data, infect) to spot exact cybercrimes.',
    concept: {
      summary:
        'Cybercrime types look similar until you isolate the exact criminal action. Spotting whether the crime relies on deception, data locking, insider theft, or malware infection keeps answers crisp and accurate.',
      keyPoints: [
        'Phishing: Deceptive emails or messages impersonating trusted institutions (like a bank) to trick users into revealing passwords or card details.',
        'Ransomware: Malicious software that encrypts or locks a victim’s files/database and demands payment (ransom) for recovery.',
        'Data Theft / Insider Breach: Copying or leaking confidential customer, financial, or employee records without authorisation.',
        'Identity Theft & Malware Infection: Stealing personal identifiers to impersonate a victim, or spreading viruses/trojans/spyware to damage or spy on systems.',
      ],
    },
    cbtTip:
      'Exam trap: Do not call ransomware "phishing"—phishing tricks a user into handing over credentials via fake messages, whereas ransomware encrypts files and demands payment to unlock them.',
    triggerTable: [
      {
        contrast: 'Phishing vs Ransomware',
        rule: 'Phishing = impersonation message stealing credentials; Ransomware = encrypting/locking files and demanding money.',
      },
      {
        contrast: 'Insider Data Theft vs External Malware',
        rule: 'Insider theft = authorised staff copying confidential data illegally; Malware = software infecting/damaging devices.',
      },
      {
        contrast: 'Spyware vs Phishing',
        rule: 'Spyware covertly monitors activity once installed; Phishing uses deceptive communication to lure user input.',
      },
      {
        contrast: 'Action-First Classification',
        rule: 'Spot the verb: impersonate (phishing), lock/extort (ransomware), copy secret records (data theft).',
      },
    ],
    guidedPractice: {
      title: '3-Scenario Crime Spotting Drill',
      scenario:
        'Classify: (1) an email pretending to be from a bank asking for a PIN, (2) a departing employee copying client spreadsheets onto a personal drive, and (3) malware locking company files until money is paid.',
      steps: [
        'Scenario 1 verb = impersonate bank to steal login -> Phishing (social engineering).',
        'Scenario 2 verb = unauthorised copying of confidential company records -> Insider data theft.',
        'Scenario 3 verb = encrypt/lock files and demand payment -> Ransomware.',
        'Reject close distractors explicitly and attach the proving clue to each sentence.',
      ],
    },
    quickCheck: [
      {
        id: 't5-s2b-q1',
        prompt: 'A learner receives an urgent email claiming to be from their bank, linking to a fake page that asks for their password. Which cybercrime is this?',
        options: ['Phishing', 'Ransomware', 'File compression', 'Page orientation'],
        correctIndex: 0,
        rationale: 'Phishing uses fake messages impersonating trusted organisations to trick victims into entering credentials.',
        leak: 'THEORY_EXPLANATION',
      },
      {
        id: 't5-s2b-q2',
        prompt: 'Attackers encrypt a company’s customer database so no staff can open it and demand payment for the decryption key. Which crime occurred?',
        options: ['Ransomware attack', 'Mail merge', 'Static hosting', 'SEO optimisation'],
        correctIndex: 0,
        rationale: 'Locking/encrypting files and demanding payment to restore access defines ransomware.',
        leak: 'THEORY_RECALL',
      },
      {
        id: 't5-s2b-q3',
        prompt: 'An employee resigns and secretly copies confidential client banking records to sell to a competitor. How is this best classified?',
        options: [
          'Unauthorised data theft / insider data breach',
          'Ethical white-hat auditing',
          'Standard backup rotation',
          'Mobile accessibility',
        ],
        correctIndex: 0,
        rationale: 'Copying confidential records without permission for personal or competitive gain is data theft.',
        leak: 'THEORY_EXPLANATION',
      },
    ],
    evidenceTask: {
      prompt: 'Build a cybercrime spotting table separating Phishing, Ransomware, Data Theft, Spyware, and Identity Theft with one distractor rejection note.',
      deliverables: [
        '5-type cybercrime spotting table',
        'Two distractor rejection notes explaining why similar crimes differ',
      ],
      checklist: [
        { id: 't5-2b-chk1', label: 'Separated Phishing, Ransomware, Data Theft, and Identity Theft by action clue' },
        { id: 't5-2b-chk2', label: 'Rejected at least two plausible distractors with explicit reasoning' },
        { id: 't5-2b-chk3', label: 'Included a type-and-reason paragraph grounded in scenario evidence' },
      ],
    },
  },
  {
    id: 'topic5-effects-prevention',
    sectionCode: '2C',
    releaseScope: 'wave1',
    category: 'cybercrime',
    title: 'Cybercrime Effects and Prevention Control',
    leakCode: 'COMMUNICATION_THEORY',
    nextAction: 'Link real cybercrime damage (money, privacy, downtime, trust) to specific technical prevention controls.',
    concept: {
      summary:
        'Cybercrime carries concrete human and business costs—financial theft, privacy exposure, operational downtime, and loss of trust. Exam answers must pair those specific damages with realistic technical prevention controls.',
      keyPoints: [
        'Core effects: Direct financial loss, identity theft/privacy breach, corrupted/lost files, business downtime, and reputational damage.',
        'Authentication control: Use long, unique passwords (never birthdates or "123456") combined with Multi-Factor Authentication (MFA).',
        'Technical & backup controls: Keep operating systems and antivirus updated, install software only from trusted sources, use firewalls, and maintain offline/cloud backups.',
        'Verification control: Inspect sender addresses and hover/check URLs before clicking links or entering banking details.',
      ],
    },
    cbtTip:
      'Exam trap: Vague advice like "be careful online" earns zero or minimal marks—name concrete controls such as MFA, strong unique passwords, regular offline backups, updated antivirus, or sender/URL verification.',
    triggerTable: [
      {
        contrast: 'Generic Advice vs Technical Prevention Control',
        rule: 'Avoid "be careful"; specify strong unique passwords + MFA, verified URLs, updated antivirus, or encrypted backups.',
      },
      {
        contrast: 'Weak Birthdate Password vs Strong Credential Rule',
        rule: 'Personal dates are easily guessed; use long passphrases mixing letters, numbers, and symbols with unique passwords per account.',
      },
      {
        contrast: 'Virus File Corruption vs Backup Recovery',
        rule: 'Antivirus blocks known threats, while regular offline/external backups ensure lost or corrupted files can be restored cleanly.',
      },
      {
        contrast: 'Unknown Download vs Trusted Source Policy',
        rule: 'Avoid pirated/unknown downloads that bundle trojans or adware; install only from verified official publishers.',
      },
    ],
    guidedPractice: {
      title: 'Effect-to-Control Remediation Drill',
      scenario:
        'A family loses irreplaceable photos after installing free software from an unknown site that triggers malware, while a clerk uses their birthdate as an email password.',
      steps: [
        'Diagnose the effects: permanent file loss/corruption from malware and high risk of unauthorised account takeover.',
        'Prescribe download & malware controls: download only from official trusted sites and run updated antivirus/firewall protection.',
        'Prescribe data recovery control: keep regular external or cloud backups disconnected from daily tampering.',
        'Prescribe credential control: replace the birthdate password with a strong unique passphrase and enable MFA.',
      ],
    },
    quickCheck: [
      {
        id: 't5-s2c-q1',
        prompt: 'A user sets their online banking password to their birthdate ("19980412"). Which prevention improvement gives full exam credit?',
        options: [
          'Tell them to "be careful"',
          'Use a long, unique passphrase with mixed characters (no personal dates) and enable Multi-Factor Authentication (MFA)',
          'Write the birthdate on a sticky note on the monitor',
          'Use the same birthdate across every site',
        ],
        correctIndex: 1,
        rationale: 'Concrete technical controls—strong unique passphrases without personal info plus MFA—directly prevent guessing attacks.',
        leak: 'COMMUNICATION_THEORY',
      },
      {
        id: 't5-s2c-q2',
        prompt: 'A virus corrupts all local workbooks on a small business PC. Which control would have allowed complete file recovery?',
        options: [
          'Regular offline or isolated cloud backups tested before the incident',
          'Increasing screen brightness',
          'Renaming corrupted files from .xlsx to .docx',
          'Turning off the monitor',
        ],
        correctIndex: 0,
        rationale: 'Maintained backups stored separately from the infected drive allow restoring intact files after malware or ransomware.',
        leak: 'THEORY_EXPLANATION',
      },
      {
        id: 't5-s2c-q3',
        prompt: 'What are two concrete business effects when a company’s customer database is leaked publicly?',
        options: [
          'Loss of customer trust/reputation and legal/financial liability for privacy breach',
          'Faster processor clock speeds',
          'Automatic Table of Contents generation',
          'Higher RAM capacity',
        ],
        correctIndex: 0,
        rationale: 'Data breaches damage customer trust, expose private data, and cause financial and legal consequences.',
        leak: 'COMMUNICATION_THEORY',
      },
    ],
    evidenceTask: {
      prompt: 'Build an effect-to-prevention control table for phishing, weak passwords, unknown downloads, and malware corruption without using generic advice.',
      deliverables: [
        '4-row effect-to-prevention table',
        'One corrected generic answer rewritten with specific technical controls',
      ],
      checklist: [
        { id: 't5-2c-chk1', label: 'Connected each cybercrime event to concrete financial, privacy, or operational damage' },
        { id: 't5-2c-chk2', label: 'Named specific technical controls (MFA, unique passphrases, backups, trusted downloads)' },
        { id: 't5-2c-chk3', label: 'Replaced vague phrases like "be careful" with actionable safeguards' },
      ],
    },
  },
  {
    id: 'topic5-ethics-decisions',
    sectionCode: '3A',
    releaseScope: 'wave2',
    category: 'ethics',
    title: 'ICT Ethics Decision Discipline',
    leakCode: 'COMMUNICATION_THEORY',
    nextAction: 'Apply ethical ICT rules across hardware care, netiquette, AUP compliance, data privacy, and software licensing.',
    concept: {
      summary:
        'ICT ethics governs responsible, fair, legal, and respectful use of computers, networks, storage devices, databases, and software—even when nobody is watching.',
      keyPoints: [
        'Physical care of computers & storage: Keep food/liquids away, never force ports or flash drives, protect from heat/dust/moisture, back up work, and safely eject removable drives.',
        'Netiquette & Social Engineering: Communicate respectfully online, verify unusual requests, and follow Acceptable Use Policies (AUP) on shared campus networks.',
        'Privacy & Databases: Protect personal records stored in databases—access only authorised records and never share or sell private learner/client data.',
        'Software Ethics & Adware: Use properly licensed software, avoid piracy/cracks (which often bundle adware or malware), and respect intellectual property.',
      ],
    },
    cbtTip:
      'Exam trap: Do not answer ethics scenarios with "because it is bad"—name the exact ICT ethics concept (e.g. AUP violation, data privacy, software piracy/adware, or improper device care) and explain the harm.',
    triggerTable: [
      {
        contrast: 'Careless Hardware Handling vs Device Care Ethics',
        rule: 'Forcing USB plugs or eating near keyboards risks physical damage and data loss; handle ports gently, keep liquids away, and safely eject drives.',
      },
      {
        contrast: 'Acceptable Use Policy (AUP) vs Unethical Network Use',
        rule: 'An AUP defines permitted campus/workplace network rules; bypassing filters or hogging bandwidth breaks ethical network use.',
      },
      {
        contrast: 'Database Access vs Privacy Breach',
        rule: 'Having database access for work does not permit viewing or sharing personal records unrelated to your duty.',
      },
      {
        contrast: 'Licensed Software vs Pirated Crack + Adware',
        rule: 'Unlicensed cracks break copyright law and frequently install unwanted adware or trojans.',
      },
    ],
    guidedPractice: {
      title: 'Ethical ICT Decision Audit',
      scenario:
        'In a campus lab, one student brings an open drink next to a PC and pulls out a flash drive mid-save, while another downloads a cracked Office installer bundled with adware.',
      steps: [
        'Issue 1 (Hardware/storage care): Open drink risks electrical damage and yanking the USB risks file corruption -> enforce no-liquids rule and Safely Eject.',
        'Issue 2 (Software licensing & adware): Downloading a cracked installer violates software copyright/AUP and introduces unwanted adware/malware.',
        'Name each ICT ethics concept explicitly before stating why it is harmful.',
        'Recommend the ethical campus action (licensed/open institutional software and proper hardware care).',
      ],
    },
    quickCheck: [
      {
        id: 't5-s3a-q1',
        prompt: 'Which set of practices demonstrates proper ethical care of lab computers and removable storage devices?',
        options: [
          'Keep food/liquids away, insert cables gently, back up important files, and use Safely Eject before removing flash drives',
          'Pull flash drives out while files are saving and place drinks near keyboards',
          'Force upside-down USB plugs until they fit',
          'Store flash drives next to strong heat and moisture',
        ],
        correctIndex: 0,
        rationale: 'Proper physical care prevents hardware damage, electrical hazards, and storage corruption.',
        leak: 'COMMUNICATION_THEORY',
      },
      {
        id: 't5-s3a-q2',
        prompt: 'An admin clerk looks up a neighbour’s private contact details in the college database out of personal curiosity. Which ethical principle is broken?',
        options: [
          'Database privacy and authorised-use ethics',
          'Mail merge filtering',
          'Page Break Preview',
          'Web 1.0 static HTML',
        ],
        correctIndex: 0,
        rationale: 'Accessing or sharing personal database records without an authorised work purpose violates data privacy ethics.',
        leak: 'COMMUNICATION_THEORY',
      },
      {
        id: 't5-s3a-q3',
        prompt: 'Why does installing pirated "cracked" software violate both ICT ethics and security?',
        options: [
          'It breaks copyright/Acceptable Use rules and frequently bundles intrusive adware or hidden malware',
          'It increases RAM speed safely',
          'It automatically updates antivirus definitions',
          'It improves battery life permanently',
        ],
        correctIndex: 0,
        rationale: 'Software piracy is unlawful, breaks institutional AUPs, and exposes devices to adware and malware.',
        leak: 'THEORY_EXPLANATION',
      },
    ],
    evidenceTask: {
      prompt: 'Build an ICT Ethics decision table covering device care, AUP compliance, database privacy, netiquette, and software licensing/adware.',
      deliverables: [
        '5-row ICT ethics decision table',
        'One corrected weak ethics answer naming the exact concept and harm',
      ],
      checklist: [
        { id: 't5-3a-chk1', label: 'Covered physical care of hardware/storage and safe drive ejection' },
        { id: 't5-3a-chk2', label: 'Named AUP, database privacy, and netiquette rules with scenario examples' },
        { id: 't5-3a-chk3', label: 'Explained both legal/ethical and adware/security risks of unlicensed software' },
      ],
    },
  },
]
