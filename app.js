const $ = (selector) => document.querySelector(selector);
const t = (text) => window.saysoTranslations.text[text] || text;
let toastTimer;
let activeVocabularyTopicId = 'conversation';
let activeVocabularySubtopic = 'all';
let activeVocabularyPartOfSpeech = 'all';
let activeGrammarLevel = 'Basic';
let activeGrammarTopicId = 'tenses';
let activeTenseLessonId = '';
const grammarTopics = [
  {
    id: 'tenses',
    label: 'Tenses',
    title: 'Tenses for everyday life',
    intro: 'Use the time and shape of an action to choose a tense. Here are the 12 common tense forms with everyday examples.',
    examples: [
      { label: 'Present simple · routines', sentence: 'I take the bus to work every morning.', note: 'Use it for habits and things that are generally true.' },
      { label: 'Present continuous · now', sentence: 'I’m waiting for my friend outside the café.', note: 'Use am/is/are + verb-ing for something happening now or around now.' },
      { label: 'Past simple · finished', sentence: 'We watched a movie after dinner last night.', note: 'Use it for an action that finished in the past.' },
      { label: 'Present perfect · life experience', sentence: 'I’ve tried that restaurant a few times.', note: 'Use have/has + past participle when the experience matters now.' },
      { label: 'Present perfect continuous · continuing activity', sentence: 'I’ve been looking for my keys for ten minutes.', note: 'Use have/has been + verb-ing for an activity that started earlier and is still happening or has just stopped.' },
      { label: 'Past continuous · action in progress', sentence: 'I was cooking when you called.', note: 'Use was/were + verb-ing for an action in progress at a past moment.' },
      { label: 'Past perfect · earlier past action', sentence: 'The shop had closed before we got there.', note: 'Use had + past participle for an action that happened before another past event.' },
      { label: 'Past perfect continuous · duration before a past moment', sentence: 'She had been driving for an hour when it started to rain.', note: 'Use had been + verb-ing to emphasize how long an activity continued before another past event.' },
      { label: 'Future with “going to” · plans', sentence: 'I’m going to call the dentist this afternoon.', note: 'Use am/is/are going to for plans and intentions.' },
      { label: 'Future with “will” · quick decisions', sentence: 'I’ll carry those bags for you.', note: 'Use will for offers, promises, and decisions made now.' },
      { label: 'Future continuous · action in progress later', sentence: 'I’ll be working from home tomorrow.', note: 'Use will be + verb-ing for an activity that will be in progress at a future time.' },
      { label: 'Future perfect · finished by a future time', sentence: 'I’ll have finished work by six.', note: 'Use will have + past participle for something completed before a future time.' }
    ]
  },
  {
    id: 'articles',
    label: 'Articles',
    title: 'A, an, and the',
    intro: 'Use a/an when you mean one non-specific thing. Use the when the listener knows which one. Use no article for things in general.',
    examples: [
      { label: 'A · before a consonant sound', sentence: 'Could I have a coffee, please?', note: 'A coffee means one coffee; “a” comes before a consonant sound.' },
      { label: 'An · before a vowel sound', sentence: 'I have an appointment at eleven.', note: 'An appointment: “appointment” starts with a vowel sound.' },
      { label: 'The · a specific thing', sentence: 'The bus is late again.', note: 'The bus means the particular bus we are waiting for.' },
      { label: 'No article · things in general', sentence: 'I love music and fresh fruit.', note: 'Use no article when talking about music or fruit in general.' }
    ]
  },
  {
    id: 'nouns',
    label: 'Nouns & pronouns',
    title: 'Nouns and pronouns',
    intro: 'Nouns name people, places, and things. Pronouns replace nouns so your sentences sound natural and do not repeat names.',
    examples: [
      { label: 'Subject pronouns', sentence: 'Maya is my neighbor. She works at the library.', note: 'She replaces Maya and is the person doing the action.' },
      { label: 'Object pronouns', sentence: 'I’ll meet them near the station.', note: 'Them receives the action of “meet.”' },
      { label: 'Possessives', sentence: 'Is this your umbrella or mine?', note: 'Your comes before a noun; mine replaces “my umbrella.”' },
      { label: 'Countable and uncountable', sentence: 'We need two tomatoes and some rice.', note: 'Tomatoes can be counted; rice is usually treated as uncountable.' }
    ]
  },
  {
    id: 'verbs',
    label: 'Verbs & modals',
    title: 'Verbs, can, should, and must',
    intro: 'A modal verb adds meaning such as ability, advice, or necessity. Use the plain verb form after a modal.',
    examples: [
      { label: 'Can · ability or a request', sentence: 'Can you help me carry this upstairs?', note: 'Can is useful for ability and friendly requests.' },
      { label: 'Could · polite request', sentence: 'Could I get the check, please?', note: 'Could makes a request sound a little more polite.' },
      { label: 'Should · advice', sentence: 'You should save the address in your phone.', note: 'Use should to suggest a good idea.' },
      { label: 'Have to · necessity', sentence: 'I have to leave early to catch my train.', note: 'Use have to for something necessary.' }
    ]
  },
  {
    id: 'prepositions',
    label: 'Prepositions',
    title: 'Prepositions of time and place',
    intro: 'A few common patterns make it easier to talk about when and where things happen.',
    examples: [
      { label: 'At · a clock time or point', sentence: 'Let’s meet at 6:30 at the entrance.', note: 'Use at for a specific time or a particular point.' },
      { label: 'On · days and surfaces', sentence: 'I work from home on Fridays.', note: 'Use on with days and dates.' },
      { label: 'In · months, years, and spaces', sentence: 'She moved here in 2022 and lives in the city center.', note: 'Use in for longer time periods and enclosed areas.' },
      { label: 'To · movement toward', sentence: 'We’re walking to the pharmacy.', note: 'Use to for a destination.' }
    ]
  },
  {
    id: 'describing',
    label: 'Adjectives & adverbs',
    title: 'Describe things and actions',
    intro: 'Adjectives describe people or things. Adverbs often describe how an action happens.',
    examples: [
      { label: 'Adjective · describes a thing', sentence: 'That was a relaxing weekend.', note: 'Relaxing describes the weekend (a noun).' },
      { label: 'Adverb · describes an action', sentence: 'She explained the directions clearly.', note: 'Clearly describes how she explained them.' },
      { label: 'Common adjective order', sentence: 'I bought a small blue backpack.', note: 'Opinion or size usually comes before color: small blue backpack.' },
      { label: 'Comparatives', sentence: 'The train is faster than the bus today.', note: 'Use faster than to compare two things.' }
    ]
  },
  {
    id: 'questions',
    label: 'Questions',
    title: 'Ask clear, natural questions',
    intro: 'Use a helping verb before the person or thing in many questions. Question words help you ask for details.',
    examples: [
      { label: 'Do · present simple', sentence: 'Do you know a good place for lunch?', note: 'Use do + subject + base verb for many present-simple questions.' },
      { label: 'Did · past simple', sentence: 'Did you get home safely last night?', note: 'Use did + base verb for past-simple questions.' },
      { label: 'Be · descriptions and plans', sentence: 'Are you free after work?', note: 'Put am/is/are before the subject.' },
      { label: 'Question words', sentence: 'Where can I recharge my phone?', note: 'Start with where to ask about a place.' }
    ]
  },
  {
    id: 'conditionals',
    label: 'Conditionals',
    title: 'Talk about possibilities',
    intro: 'Conditional sentences connect a situation with its result. They are useful for plans, advice, and imagining alternatives.',
    examples: [
      { label: 'Real possibility', sentence: 'If it rains, we’ll take a taxi.', note: 'Use present simple after if, then will for a possible result.' },
      { label: 'General truth', sentence: 'If I skip breakfast, I get hungry before lunch.', note: 'Use present simple in both parts for things that usually happen.' },
      { label: 'Imaginary situation', sentence: 'If I had a free day, I’d visit my sister.', note: 'Use past simple + would to imagine a different situation.' },
      { label: 'Polite offer', sentence: 'If you need a ride, I can pick you up.', note: 'Use if to offer help when a situation happens.' }
    ]
  },
  {
    id: 'conjunctions',
    label: 'Conjunctions',
    title: 'Connect your ideas',
    intro: 'Conjunctions link words and thoughts so you can explain reasons, choices, and contrasts.',
    examples: [
      { label: 'And · add an idea', sentence: 'I picked up bread and some fresh fruit.', note: 'Use and to add similar information.' },
      { label: 'But · show a contrast', sentence: 'I’d love to come, but I have to work late.', note: 'Use but when the next idea contrasts with the first.' },
      { label: 'Because · give a reason', sentence: 'I took a jacket because it gets cold at night.', note: 'Use because to explain why something happens.' },
      { label: 'So · show a result', sentence: 'The café was full, so we went somewhere else.', note: 'Use so to introduce the result.' }
    ]
  },
  {
    id: 'sentences',
    label: 'Sentence structure',
    title: 'Build complete sentences',
    intro: 'A clear sentence usually has a subject and a verb. Add details in a natural order to make your meaning easy to follow.',
    examples: [
      { label: 'Subject + verb', sentence: 'The baby is sleeping.', note: 'The baby is the subject; is sleeping tells what is happening.' },
      { label: 'Subject + verb + object', sentence: 'I left my keys on the kitchen table.', note: 'The object (my keys) receives the action.' },
      { label: 'Join two complete ideas', sentence: 'I finished my shift, and I met a friend for dinner.', note: 'A comma and conjunction can join two closely related complete thoughts.' },
      { label: 'Avoid a sentence fragment', sentence: 'Because the train was late, I called the office.', note: 'A because-clause needs a main idea to complete the sentence.' }
    ]
  },
  {
    id: 'agreement',
    label: 'Agreement',
    title: 'Make subjects and verbs agree',
    intro: 'In the present tense, the verb form changes with the subject. Matching them makes everyday sentences sound correct.',
    examples: [
      { label: 'One person or thing', sentence: 'My brother works near the airport.', note: 'Use a verb ending in -s with he, she, it, or a singular noun.' },
      { label: 'I, you, or more than one', sentence: 'My friends work near the airport.', note: 'Use the base verb with I, you, we, they, and plural nouns.' },
      { label: 'There is · one thing', sentence: 'There’s a pharmacy on this street.', note: 'Use is with one thing.' },
      { label: 'There are · more than one', sentence: 'There are two pharmacies nearby.', note: 'Use are with plural things.' }
    ]
  },
  {
    id: 'phrasal-verbs',
    label: 'Phrasal verbs',
    title: 'Common phrasal verbs',
    intro: 'A phrasal verb combines a verb with a short word such as up, on, or off. These common phrases are useful every day.',
    examples: [
      { label: 'Pick up · collect', sentence: 'I’ll pick up the groceries on my way home.', note: 'Pick up means to collect someone or something.' },
      { label: 'Find out · discover', sentence: 'I’ll find out what time the store closes.', note: 'Find out means to learn or discover information.' },
      { label: 'Run out of · have none left', sentence: 'We’ve run out of coffee. Can you get some?', note: 'Run out of means to use all of something.' },
      { label: 'Put off · postpone', sentence: 'They put off the meeting until Friday.', note: 'Put off means to delay something.' }
    ]
  },
  {
    id: 'voice',
    label: 'Active & reported speech',
    title: 'Active, passive, and reported speech',
    intro: 'Active sentences focus on who does something. Passive sentences focus on what happens. Reported speech tells someone what another person said.',
    examples: [
      { label: 'Active · who did it', sentence: 'The manager changed my schedule.', note: 'The subject (the manager) does the action.' },
      { label: 'Passive · what happened', sentence: 'My schedule was changed this morning.', note: 'Use be + past participle when the action or result matters more than who did it.' },
      { label: 'Reported speech · sharing information', sentence: 'Mina said she was on her way.', note: 'Use said to tell someone what another person shared.' },
      { label: 'Reported request', sentence: 'He asked me to send the address.', note: 'Use asked + person + to + verb to report a request.' }
    ]
  },
  {
    id: 'punctuation',
    label: 'Punctuation',
    title: 'Punctuation in messages',
    intro: 'Simple punctuation makes texts, emails, and messages easier to understand.',
    examples: [
      { label: 'Full stop · finish a thought', sentence: 'I’ll be there in ten minutes.', note: 'Use a full stop to show a statement is complete.' },
      { label: 'Question mark · ask something', sentence: 'Are we still meeting at the station?', note: 'End a direct question with a question mark.' },
      { label: 'Comma · add a pause', sentence: 'Hi, Jordan, I’m running a little late.', note: 'Use commas to separate a greeting or introductory words.' },
      { label: 'Apostrophe · contractions', sentence: 'I can’t find my phone.', note: 'The apostrophe in can’t marks missing letters.' }
    ]
  }
];
const tenseLessons = [
  {
    id: 'present-simple', level: 'Basic', title: 'Present simple',
    pattern: 'Subject + base verb (add -s/-es with he, she, or it). Use do/does + base verb for questions and don’t/doesn’t for negatives.',
    use: 'Use it for habits, routines, facts, and things that are generally true.',
    examples: ['I take the bus to work every morning.', 'She doesn’t drink coffee after lunch.', 'Do they live near here?'],
    mistake: 'For he/she/it, remember -s in statements: “She works here,” not “She work here.” After does/doesn’t, use the base verb: “Does she work?”',
    question: 'My brother ___ dinner at home every evening.', choices: ['cook', 'cooks', 'is cook'], answer: 'cooks', feedback: 'With he/she/it, add -s to the present-simple verb.'
  },
  {
    id: 'present-continuous', level: 'Basic', title: 'Present continuous',
    pattern: 'Subject + am/is/are + verb-ing.',
    use: 'Use it for an action happening now, a temporary situation, or an arranged near-future plan.',
    examples: ['I’m waiting for my friend outside the café.', 'We aren’t working from home today.', 'Are you meeting Sam after class?'],
    mistake: 'Do not leave out the helping verb: say “She is working,” not “She working.”',
    question: 'Please wait a minute. I ___ to the manager now.', choices: ['talk', 'am talking', 'talked'], answer: 'am talking', feedback: '“Now” shows an action in progress: am/is/are + verb-ing.'
  },
  {
    id: 'past-simple', level: 'Basic', title: 'Past simple',
    pattern: 'Subject + past verb. Use did + base verb for questions and didn’t + base verb for negatives.',
    use: 'Use it for an action that started and finished at a known or understood past time.',
    examples: ['We watched a movie last night.', 'He didn’t call me yesterday.', 'Did you get home safely?'],
    mistake: 'After did/didn’t, use the base form: “Did you go?” not “Did you went?”',
    question: 'We ___ our friends at the station yesterday.', choices: ['meet', 'met', 'have meet'], answer: 'met', feedback: '“Yesterday” is a finished past time, so use the past form met.'
  },
  {
    id: 'past-continuous', level: 'Elementary', title: 'Past continuous',
    pattern: 'Subject + was/were + verb-ing.',
    use: 'Use it for an action in progress at a past moment, often when another action happened.',
    examples: ['I was cooking when you called.', 'They were driving home at nine.', 'Was she sleeping when you arrived?'],
    mistake: 'Use was with I/he/she/it and were with you/we/they.',
    question: 'At 8 p.m. last night, we ___ dinner.', choices: ['were having', 'had have', 'are having'], answer: 'were having', feedback: 'An action in progress at a past time uses were + verb-ing.'
  },
  {
    id: 'present-perfect', level: 'Elementary', title: 'Present perfect',
    pattern: 'Subject + have/has + past participle.',
    use: 'Use it for life experiences, recent results, or past actions connected to the present. Do not use it with a finished time such as yesterday.',
    examples: ['I’ve tried that restaurant a few times.', 'She has just finished her shift.', 'Have you ever visited Delhi?'],
    mistake: 'Use the past participle after have/has: “has gone,” not “has went.”',
    question: 'I ___ my keys, so I can’t open the door.', choices: ['have lost', 'lost yesterday', 'am lose'], answer: 'have lost', feedback: 'The lost keys matter now, so present perfect is natural.'
  },
  {
    id: 'present-perfect-continuous', level: 'Intermediate', title: 'Present perfect continuous',
    pattern: 'Subject + have/has been + verb-ing.',
    use: 'Use it for an activity that began earlier and is still happening, or has just stopped. It often emphasizes duration or effort.',
    examples: ['I’ve been looking for my keys for ten minutes.', 'She has been studying since breakfast.', 'Have they been waiting long?'],
    mistake: 'Use “for” with a length of time and “since” with a starting point: “for two hours,” “since noon.”',
    question: 'He is tired because he ___ all morning.', choices: ['has been working', 'is work', 'worked tomorrow'], answer: 'has been working', feedback: 'The activity continued through the morning and explains his current tiredness.'
  },
  {
    id: 'past-perfect', level: 'Intermediate', title: 'Past perfect',
    pattern: 'Subject + had + past participle.',
    use: 'Use it for an action completed before another past event. The earlier event uses past perfect; the later event often uses past simple.',
    examples: ['The shop had closed before we got there.', 'I had already eaten when they invited me to dinner.', 'Had you met her before the party?'],
    mistake: 'Use had + past participle, not had + past simple: “had gone,” not “had went.”',
    question: 'When we arrived, the movie ___.', choices: ['already started', 'had already started', 'has already start'], answer: 'had already started', feedback: 'The movie started before we arrived, so use past perfect.'
  },
  {
    id: 'past-perfect-continuous', level: 'Intermediate', title: 'Past perfect continuous',
    pattern: 'Subject + had been + verb-ing.',
    use: 'Use it to emphasize how long an activity continued before a later past event.',
    examples: ['She had been driving for an hour when it started to rain.', 'We had been waiting for thirty minutes before the bus came.', 'He was tired because he had been working all night.'],
    mistake: 'Use had been + verb-ing for the earlier continuing activity; use past simple for the event that followed.',
    question: 'They ___ for an hour before the doctor called them.', choices: ['had been waiting', 'have waited tomorrow', 'were wait'], answer: 'had been waiting', feedback: 'The waiting continued before another past event, so use had been + verb-ing.'
  },
  {
    id: 'future-going-to', level: 'Basic', title: 'Future with going to',
    pattern: 'Subject + am/is/are going to + base verb.',
    use: 'Use it for plans and intentions, or for a future result that seems likely from what you can see now.',
    examples: ['I’m going to call the dentist this afternoon.', 'Look at those clouds—it’s going to rain.', 'Are you going to cook tonight?'],
    mistake: 'Use the base verb after going to: “going to call,” not “going to called.”',
    question: 'We bought the tickets. We ___ the concert on Friday.', choices: ['are going to see', 'going see', 'saw'], answer: 'are going to see', feedback: 'The tickets show a plan: am/is/are going to + base verb.'
  },
  {
    id: 'future-will', level: 'Basic', title: 'Future with will',
    pattern: 'Subject + will + base verb. Negative: will not/won’t + base verb.',
    use: 'Use it for quick decisions, offers, promises, and predictions or beliefs about the future.',
    examples: ['I’ll carry those bags for you.', 'I think the meeting will finish soon.', 'She won’t be late.'],
    mistake: 'Do not add -s or “to” after will: “He will call,” not “He wills call” or “He will to call.”',
    question: 'The phone is ringing. I ___ it.', choices: ['will answer', 'answering', 'am answered'], answer: 'will answer', feedback: 'A decision made at the moment of speaking commonly uses will.'
  },
  {
    id: 'future-continuous', level: 'Intermediate', title: 'Future continuous',
    pattern: 'Subject + will be + verb-ing.',
    use: 'Use it for an activity that will be in progress at a particular future time, or for a polite question about someone’s plans.',
    examples: ['I’ll be working from home tomorrow.', 'This time next week, we’ll be staying with my cousins.', 'Will you be using the car tonight?'],
    mistake: 'Keep both parts: will be + verb-ing. Do not use “will working.”',
    question: 'At this time tomorrow, they ___ to Mumbai.', choices: ['will be flying', 'will fly yesterday', 'are fly'], answer: 'will be flying', feedback: 'The sentence describes an action in progress at a specific future time.'
  },
  {
    id: 'future-perfect', level: 'Intermediate', title: 'Future perfect',
    pattern: 'Subject + will have + past participle.',
    use: 'Use it for an action that will be completed before a specified future time, often with “by.”',
    examples: ['I’ll have finished work by six.', 'By next June, she will have completed her course.', 'Will you have sent the report by Friday?'],
    mistake: 'Use the past participle after have: “will have finished,” not “will have finish.”',
    question: 'By the time you arrive, we ___ dinner.', choices: ['will have prepared', 'prepared tomorrow', 'will preparing'], answer: 'will have prepared', feedback: 'The preparation will be complete before your future arrival.'
  }
];
const grammarTopicLevels = {
  articles: ['Basic', 'Elementary'], nouns: ['Basic', 'Elementary'], verbs: ['Basic', 'Elementary', 'Intermediate'],
  prepositions: ['Basic', 'Elementary'], describing: ['Elementary', 'Intermediate'],
  questions: ['Basic', 'Elementary', 'Intermediate'], conditionals: ['Elementary', 'Intermediate'],
  conjunctions: ['Elementary', 'Intermediate'], sentences: ['Basic', 'Elementary', 'Intermediate'],
  agreement: ['Basic', 'Elementary'], 'phrasal-verbs': ['Elementary', 'Intermediate'],
  voice: ['Intermediate'], punctuation: ['Basic', 'Elementary']
};
const grammarExercises = {
  articles: { prompt: 'I saw ___ elephant at the zoo.', choices: ['a', 'an', 'the'], answer: 'an', feedback: 'Use “an” before a vowel sound when introducing one non-specific thing.' },
  nouns: { prompt: 'Ravi and I are friends. ___ play football together.', choices: ['We', 'Us', 'Our'], answer: 'We', feedback: 'Use the subject pronoun “we” as the subject of play.' },
  verbs: { prompt: 'You ___ wear a seat belt in a car.', choices: ['should', 'should to', 'shoulds'], answer: 'should', feedback: 'Use a modal + the base verb, without “to.”' },
  prepositions: { prompt: 'My appointment is ___ Monday ___ 10 a.m.', choices: ['in / at', 'on / at', 'at / on'], answer: 'on / at', feedback: 'Use “on” for days and “at” for clock times.' },
  describing: { prompt: 'She speaks very ___.', choices: ['clear', 'clearly', 'clearness'], answer: 'clearly', feedback: 'An adverb (clearly) describes how she speaks.' },
  questions: { prompt: '___ you like some tea?', choices: ['Would', 'Are', 'Have'], answer: 'Would', feedback: '“Would you like…?” is a natural polite offer.' },
  conditionals: { prompt: 'If it rains, we ___ at home.', choices: ['will stay', 'stayed', 'would stayed'], answer: 'will stay', feedback: 'First conditional: If + present simple, will + base verb.' },
  conjunctions: { prompt: 'I was tired, ___ I went to bed early.', choices: ['so', 'because', 'although'], answer: 'so', feedback: '“So” introduces the result: I went to bed early.' },
  sentences: { prompt: 'Choose the natural word order.', choices: ['She every day walks to work.', 'She walks to work every day.', 'Every day to work she walk.'], answer: 'She walks to work every day.', feedback: 'A common order is subject + verb + place + time.' },
  agreement: { prompt: 'The children ___ playing outside.', choices: ['is', 'are', 'was'], answer: 'are', feedback: '“Children” is plural, so use “are.”' },
  'phrasal-verbs': { prompt: 'It’s late. Please ___ the lights.', choices: ['turn off', 'turn into', 'turn up'], answer: 'turn off', feedback: '“Turn off” means stop a light or device from operating.' },
  voice: { prompt: 'Choose the passive form: “They deliver the packages every day.”', choices: ['The packages are delivered every day.', 'The packages delivered every day.', 'The packages were deliver every day.'], answer: 'The packages are delivered every day.', feedback: 'Present simple passive = am/is/are + past participle.' },
  punctuation: { prompt: 'Which sentence is punctuated correctly?', choices: ['Where are you going.', 'Where are you going?', 'Where, are you going?'], answer: 'Where are you going?', feedback: 'A direct question ends with a question mark.' }
};
const vocabularyTopics = [
  {
    id: 'conversation',
    label: 'Basic conversation',
    title: 'Useful words for everyday conversation',
    intro: 'These short, natural expressions help you greet people, respond, ask for help, and keep a conversation going.',
    words: [
      { word: 'Actually', type: 'Sharing a correction or new detail', forms: [['Similar phrase', 'In fact'], ['Example', 'Actually, I live just around the corner.']], note: 'Use it to gently add or correct information.' },
      { word: 'Sure', type: 'Agreeing or offering help', forms: [['Similar phrases', 'Of course · No problem'], ['Example', 'Sure, I can send you the address.']], note: 'A friendly, everyday way to say yes.' },
      { word: 'Maybe', type: 'An uncertain answer', forms: [['Similar phrase', 'Possibly'], ['Example', 'Maybe we can meet after work.']], note: 'Use it when something is possible but not decided.' },
      { word: 'By the way', type: 'Changing to a related topic', forms: [['Example', 'By the way, have you seen my keys?']], note: 'Often used to add a quick question or extra detail.' },
      { word: 'I mean', type: 'Clarifying what you said', forms: [['Example', 'It’s close—I mean, about a five-minute walk.']], note: 'Use it to explain your meaning or rephrase.' },
      { word: 'That sounds good', type: 'Responding positively to an idea', forms: [['Similar phrases', 'Sounds great · I’m in'], ['Example', 'Dinner at seven? That sounds good.']], note: 'A natural response when you like a suggestion.' },
      { word: 'Could you…?', type: 'Making a polite request', forms: [['Example', 'Could you speak a little more slowly, please?']], note: 'Could you + base verb is a polite way to ask for help.' },
      { word: 'I’m not sure', type: 'Giving a gentle uncertain answer', forms: [['Similar phrase', 'I’m not certain'], ['Example', 'I’m not sure what time the store closes.']], note: 'A useful alternative to a direct “no” when you need more information.' }
    ]
  },
  {
    id: 'verbs',
    label: 'Verbs & forms',
    title: 'Common verbs and their forms',
    intro: 'Learn the base verb, he/she form, past simple, past participle, and -ing form. The example shows a natural everyday use.',
    words: [
      { word: 'be', type: 'to exist or describe', forms: [['Base', 'be'], ['He / she', 'is'], ['Past', 'was / were'], ['Past participle', 'been'], ['-ing', 'being']], example: 'I’ve been busy all morning.' },
      { word: 'have', type: 'to own or experience', forms: [['Base', 'have'], ['He / she', 'has'], ['Past', 'had'], ['Past participle', 'had'], ['-ing', 'having']], example: 'We’re having lunch with Maya today.' },
      { word: 'do', type: 'to perform an action', forms: [['Base', 'do'], ['He / she', 'does'], ['Past', 'did'], ['Past participle', 'done'], ['-ing', 'doing']], example: 'Did you do the laundry?' },
      { word: 'go', type: 'to move or travel', forms: [['Base', 'go'], ['He / she', 'goes'], ['Past', 'went'], ['Past participle', 'gone'], ['-ing', 'going']], example: 'I’m going to the supermarket after work.' },
      { word: 'get', type: 'to receive, become, or arrive', forms: [['Base', 'get'], ['He / she', 'gets'], ['Past', 'got'], ['Past participle', 'got / gotten'], ['-ing', 'getting']], example: 'What time did you get home?' },
      { word: 'make', type: 'to create or prepare', forms: [['Base', 'make'], ['He / she', 'makes'], ['Past', 'made'], ['Past participle', 'made'], ['-ing', 'making']], example: 'I’ll make some tea.' },
      { word: 'take', type: 'to carry, use, or travel by', forms: [['Base', 'take'], ['He / she', 'takes'], ['Past', 'took'], ['Past participle', 'taken'], ['-ing', 'taking']], example: 'She takes the bus to work.' },
      { word: 'come', type: 'to move toward a place or person', forms: [['Base', 'come'], ['He / she', 'comes'], ['Past', 'came'], ['Past participle', 'come'], ['-ing', 'coming']], example: 'Are you coming to the party?' }
    ]
  },
  {
    id: 'adjectives',
    label: 'Adjectives',
    title: 'Adjectives for describing people and things',
    intro: 'Adjectives describe nouns: people, places, and things. Compare common forms and notice related adverbs where useful.',
    words: [
      { word: 'good', type: 'positive or of a high standard', forms: [['Comparative', 'better'], ['Superlative', 'best'], ['Related adverb', 'well']], example: 'That’s a good idea. You explained it well.' },
      { word: 'happy', type: 'feeling pleased', forms: [['Comparative', 'happier'], ['Superlative', 'happiest'], ['Related adverb', 'happily']], example: 'She’s happy with her new job.' },
      { word: 'easy', type: 'not difficult', forms: [['Comparative', 'easier'], ['Superlative', 'easiest'], ['Related adverb', 'easily']], example: 'The instructions are easy to follow.' },
      { word: 'careful', type: 'giving attention to avoid mistakes', forms: [['Comparative', 'more careful'], ['Superlative', 'most careful'], ['Related adverb', 'carefully']], example: 'Be careful with that hot pan.' },
      { word: 'busy', type: 'having a lot to do', forms: [['Comparative', 'busier'], ['Superlative', 'busiest'], ['Related adverb', '—']], example: 'I’m busy this afternoon, but I’m free tomorrow.' },
      { word: 'friendly', type: 'kind and pleasant', forms: [['Comparative', 'friendlier'], ['Superlative', 'friendliest'], ['Related adverb', 'in a friendly way']], example: 'Our new neighbors are really friendly.' },
      { word: 'comfortable', type: 'relaxed or physically at ease', forms: [['Comparative', 'more comfortable'], ['Superlative', 'most comfortable'], ['Related adverb', 'comfortably']], example: 'These shoes are comfortable enough for walking.' },
      { word: 'important', type: 'having special value or meaning', forms: [['Comparative', 'more important'], ['Superlative', 'most important'], ['Related adverb', 'importantly']], example: 'It’s important to get enough sleep.' }
    ]
  },
  {
    id: 'adverbs',
    label: 'Adverbs',
    title: 'Adverbs that make everyday sentences clearer',
    intro: 'Adverbs can tell us how, when, or how often something happens. Many manner adverbs end in -ly, but not all do.',
    words: [
      { word: 'usually', type: 'how often · most of the time', forms: [['Example', 'I usually walk to work.']], note: 'Place it before most main verbs, but after “be”: “She is usually early.”' },
      { word: 'sometimes', type: 'how often · on some occasions', forms: [['Example', 'We sometimes cook dinner together.']], note: 'Often goes before the main verb or at the beginning/end of a sentence.' },
      { word: 'already', type: 'by this time', forms: [['Example', 'I’ve already sent the email.']], note: 'Commonly used before the main verb or after “have/has.”' },
      { word: 'soon', type: 'in a short time', forms: [['Example', 'The bus should be here soon.']], note: 'A time adverb; it does not need -ly.' },
      { word: 'carefully', type: 'in a way that avoids mistakes', forms: [['Adjective form', 'careful'], ['Example', 'Please drive carefully in the rain.']], note: 'Often formed with adjective + -ly.' },
      { word: 'quickly', type: 'at a fast speed', forms: [['Adjective form', 'quick'], ['Example', 'Can you get ready quickly?']], note: 'Quickly describes how someone gets ready.' },
      { word: 'well', type: 'in a good or skilled way', forms: [['Adjective form', 'good'], ['Example', 'He speaks English very well.']], note: 'Well is the adverb form of good.' },
      { word: 'too', type: 'more than is wanted or needed', forms: [['Example', 'This coffee is too hot to drink.']], note: 'Too usually comes before an adjective or adverb.' }
    ]
  },
  {
    id: 'word-families',
    label: 'Word families',
    title: 'Learn related forms together',
    intro: 'One root can create a noun, verb, adjective, or adverb. Learning related forms together helps you choose the right word in a sentence.',
    words: [
      { word: 'help', type: 'support or assist someone', forms: [['Noun', 'help / helper'], ['Verb', 'help'], ['Adjective', 'helpful'], ['Adverb', 'helpfully']], example: 'My neighbor was very helpful when I moved.' },
      { word: 'care', type: 'attention or concern', forms: [['Noun', 'care'], ['Verb', 'care'], ['Adjective', 'careful / careless'], ['Adverb', 'carefully / carelessly']], example: 'Take care when you cross the street.' },
      { word: 'comfort', type: 'a feeling of ease', forms: [['Noun', 'comfort'], ['Verb', 'comfort'], ['Adjective', 'comfortable'], ['Adverb', 'comfortably']], example: 'We sat comfortably by the window.' },
      { word: 'success', type: 'achieving a desired result', forms: [['Noun', 'success'], ['Verb', 'succeed'], ['Adjective', 'successful'], ['Adverb', 'successfully']], example: 'She successfully finished her course.' },
      { word: 'beauty', type: 'the quality of being beautiful', forms: [['Noun', 'beauty'], ['Verb', '—'], ['Adjective', 'beautiful'], ['Adverb', 'beautifully']], example: 'The garden is beautiful in spring.' },
      { word: 'difference', type: 'a way in which things are not the same', forms: [['Noun', 'difference'], ['Verb', 'differ'], ['Adjective', 'different'], ['Adverb', 'differently']], example: 'We all learn differently.' },
      { word: 'decision', type: 'a choice you make', forms: [['Noun', 'decision'], ['Verb', 'decide'], ['Adjective', 'decisive'], ['Adverb', 'decisively']], example: 'I need a little time to decide.' },
      { word: 'interest', type: 'attention or curiosity about something', forms: [['Noun', 'interest'], ['Verb', 'interest'], ['Adjective', 'interested / interesting'], ['Adverb', 'interestingly']], example: 'I’m interested in learning new words.' }
    ]
  },
  {
    id: 'daily',
    label: 'Daily use words',
    title: '100+ words for everyday life',
    intro: 'A practical starter list of common words for home, shopping, food, time, travel, and daily routines.',
    words: []
  }
];
const vocabularyBanks = {
  conversation: `How are you?|How’s it going?|Nice to meet you.|Good to see you.|What’s up?|I’m doing well.|Not bad.|Pretty good.|And you?|Good morning.|Good afternoon.|Good evening.|Good night.|See you later.|See you soon.|Take care.|Have a good day.|Have a good one.|Talk to you later.|It was nice talking to you.|Please.|Thank you.|Thanks a lot.|You’re welcome.|No problem.|Of course.|Sure thing.|Absolutely.|Definitely.|I think so.|I don’t think so.|Maybe.|Probably.|I’m not sure.|I have no idea.|That’s right.|Exactly.|That makes sense.|I agree.|I disagree.|I’m sorry.|No worries.|Excuse me.|Pardon me.|Could you help me?|Could you repeat that?|Could you speak slowly?|What do you mean?|What happened?|What’s the matter?|Are you okay?|Is everything all right?|Let me know.|Give me a moment.|Just a second.|Hang on.|Here you go.|There you are.|After you.|Go ahead.|That sounds good.|Sounds great.|That works for me.|I’m in.|Maybe next time.|I’d love to.|I’d rather not.|It depends.|By the way.|Actually.|I mean.|For example.|To be honest.|As far as I know.|That’s interesting.|Really?|Are you serious?|You’re right.|I see.|Got it.|I understand.|I don’t understand.|Could you explain?|What do you think?|How about you?|What about this?|Why not?|Let’s do it.|Let’s see.|I’m on my way.|I’ll be right back.|I’m running late.|No rush.|Be careful.|Good luck.|Congratulations.|That’s too bad.|What a shame.|It doesn’t matter.|That’s fine.|I’m just looking.|Can I ask you something?|Would you mind?|It was my pleasure.|Keep in touch.|Welcome back.|Make yourself at home.|I’m glad to hear that.|I hope so.|I hope not.|That’s all right.`,
  verbs: `ask|answer|add|agree|allow|arrive|ask| bake|be|begin|believe|belong|borrow|break|bring|build|buy|call|carry|catch|change|choose|clean|close|come|cook|cost|count|create|cut|dance|decide|describe|do|draw|drink|drive|eat|enjoy|explain|fall|feel|find|finish|fix|follow|forget|get|give|go|grow|happen|have|hear|help|hold|hope|invite|join|keep|know|learn|leave|lend|let|like|listen|live|look|lose|love|make|mean|meet|miss|move|need|notice|offer|open|order|organize|pay|plan|play|practice|prefer|prepare|promise|put|read|remember|repeat|reply|run|say|see|sell|send|share|show|sit|sleep|speak|spend|stand|start|stay|stop|study|suggest|take|talk|teach|tell|think|throw|try|turn|understand|use|visit|wait|wake|walk|want|watch|wear|win|work|write`,
  adjectives: `able|active|afraid|amazing|angry|annoyed|available|bad|beautiful|better|big|bitter|black|blue|boring|brave|bright|busy|calm|careful|cheap|cheerful|clean|clear|clever|comfortable|common|confident|confused|convenient|cool|correct|curious|cute|dangerous|dark|delicious|different|difficult|early|easy|excited|expensive|fair|familiar|famous|fantastic|fast|favorite|fine|friendly|fun|funny|gentle|glad|good|great|green|happy|hard|healthy|helpful|honest|hot|important|interested|interesting| kind|kind|large|late|lazy|light|little|local|lonely|long|loud|lucky|modern|natural|necessary|nervous|new|nice|noisy| normal|old|open| patient|peaceful|perfect|personal|polite|popular|possible|pretty| proud|quick|quiet|ready|real|reasonable|relaxed|rich|right| safe|sad| salty|same|serious|short|shy|sick|simple|slow|small|smart|soft|special|strong|successful|sweet| tall| tasty| tired|true|useful| warm|weak|welcome| well|wet|white| wonderful| worried| young`,
  adverbs: `about|above|absolutely|almost|already|also|always|away|badly|basically|carefully|certainly|clearly|closely|comfortably|completely|correctly|daily|definitely|easily|especially|even|eventually|ever|exactly|fast|finally|frequently|generally|gently|happily|hard|here|honestly|hopefully|immediately|inside|instead|just|kindly|late|later|maybe|mostly|naturally| nearly|never|normally|not|now|occasionally|often|only|outside|perfectly|perhaps|politely|possibly|probably|quickly|quietly|rarely|really|recently|regularly|right|sadly|safely|seriously|simply|slowly|sometimes|soon|still| straight|suddenly|surely|there|today|together|tomorrow|too|usually|very|well|yesterday|yet|forward|back|down|up|far|near|loudly|softly|strongly|weakly|eagerly|fairly|highly|nearly|rather|quite|somewhere|anywhere|everywhere|nowhere|apart|around|away|elsewhere|first|second|last|early|late|forever|recently|currently|previously|shortly|finally|often|twice|once|daily|weekly|monthly|yearly`,
  families: `able|active|angry|anxious|beautiful|bright|careful|careless|certain|cheerful|clear|comfortable|confident|correct|creative|curious|daily|dangerous|different|easy|efficient|equal|exact|excited|fair|faithful|familiar|famous|final|fortunate|free|frequent|friendly|full|general|gentle|glad|grateful|great|happy|hard|healthy|helpful|honest|hopeful|immediate|important|independent| intelligent|interesting|kind|large|late|lazy|likely|lively|lonely|loud|lucky|main|major| natural|necessary|nervous|new|normal|occasional|official|patient|peaceful|perfect|personal|polite|possible|powerful|practical|precise| quick|quiet|rapid|rare| real|recent|regular|relaxed|reliable|safe|sad|safe|serious|short| simple|slow|smart|soft| special|successful| sudden|sure|surprising| sweet| swift|terrible|thankful|thoughtful|true|typical|usual|useful|warm|weak|wide|wise|wonderful|wrong|young`,
  daily: `home|house|room|door|window|table|chair|bed|kitchen|bathroom|key|phone|charger|bag|wallet|money|card|clothes|shirt|shoes|coat|food|bread|rice|water|milk|coffee|tea|breakfast|lunch|dinner|snack|fruit|apple|banana|vegetable|egg|cheese|store|shop|market|price|sale|receipt|cash|change|street|road|corner|address|map|bus|train|ticket|station|car|bicycle|traffic|trip|weather|sun|rain|cloud|time|day|week|month|year|morning|afternoon|evening|weekend|today|tomorrow|yesterday|work|job|office|school|class|teacher|student|friend|family|neighbor|child|parent|doctor|appointment|health|medicine|problem|question|answer|help|break|plan|idea|message|email|meeting|place|thing|people|person|name|number|story|movie|music|game|book|paper|pen|computer|internet|light|heat|cleaning|laundry|shower|breakfast|habit|list|box|bottle|cup|plate|spoon|fork|knife|towel|soap|brush|clock|calendar|week|holiday|birthday|party|gift|photo|picture|garden|park|library|restaurant|cafe|bank|hospital|pharmacy|airport|hotel|vacation|language|word|sentence|lesson|practice|sleep|exercise|walk|shopping|cooking|weather|noise|quiet|safe|busy|open|closed`
};
const hindiMeanings = {
  'How are you?': 'आप कैसे हैं?', 'How’s it going?': 'सब कैसा चल रहा है?', 'Nice to meet you.': 'आपसे मिलकर अच्छा लगा।',
  'Good to see you.': 'आपको देखकर अच्छा लगा।', 'What’s up?': 'क्या हाल है?', 'I’m doing well.': 'मैं ठीक हूँ।',
  'Not bad.': 'बुरा नहीं है।', 'Pretty good.': 'काफ़ी अच्छा।', 'And you?': 'और आप?', 'Good morning.': 'सुप्रभात।',
  'Good afternoon.': 'नमस्कार।', 'Good evening.': 'शुभ संध्या।', 'Good night.': 'शुभ रात्रि।',
  'See you later.': 'फिर मिलते हैं।', 'See you soon.': 'जल्दी मिलते हैं।', 'Take care.': 'अपना ख्याल रखना।',
  'Have a good day.': 'आपका दिन अच्छा हो।', 'Have a good one.': 'आपका दिन अच्छा गुज़रे।',
  'Talk to you later.': 'बाद में बात करते हैं।', 'It was nice talking to you.': 'आपसे बात करके अच्छा लगा।',
  'Please.': 'कृपया।', 'Thank you.': 'धन्यवाद।', 'Thanks a lot.': 'बहुत-बहुत धन्यवाद।',
  'You’re welcome.': 'आपका स्वागत है।', 'No problem.': 'कोई बात नहीं।', 'Of course.': 'बिलकुल।',
  'Sure thing.': 'ज़रूर।', 'Absolutely.': 'बिलकुल।', 'Definitely.': 'निश्चित रूप से।',
  'I think so.': 'मुझे ऐसा लगता है।', 'I don’t think so.': 'मुझे ऐसा नहीं लगता।', 'Maybe.': 'शायद।',
  'Probably.': 'संभवतः।', 'I’m not sure.': 'मुझे पक्का नहीं पता।', 'I have no idea.': 'मुझे बिल्कुल पता नहीं।',
  'That’s right.': 'यह सही है।', 'Exactly.': 'बिलकुल सही।', 'That makes sense.': 'यह बात समझ में आती है।',
  'I agree.': 'मैं सहमत हूँ।', 'I disagree.': 'मैं सहमत नहीं हूँ।', 'I’m sorry.': 'मुझे माफ़ कीजिए।',
  'No worries.': 'चिंता की बात नहीं।', 'Excuse me.': 'सुनिए / माफ़ कीजिए।', 'Pardon me.': 'कृपया फिर से कहिए।',
  'Could you help me?': 'क्या आप मेरी मदद कर सकते हैं?', 'Could you repeat that?': 'क्या आप इसे दोहरा सकते हैं?',
  'Could you speak slowly?': 'क्या आप धीरे बोल सकते हैं?', 'What do you mean?': 'आपका क्या मतलब है?',
  'What happened?': 'क्या हुआ?', 'What’s the matter?': 'क्या बात है?', 'Are you okay?': 'क्या आप ठीक हैं?',
  'Is everything all right?': 'क्या सब ठीक है?', 'Let me know.': 'मुझे बताइए।', 'Give me a moment.': 'मुझे एक पल दीजिए।',
  'Just a second.': 'बस एक सेकंड।', 'Hang on.': 'ज़रा रुकिए।', 'Here you go.': 'लीजिए।',
  'There you are.': 'यह लीजिए।', 'After you.': 'पहले आप।', 'Go ahead.': 'आगे बढ़िए।',
  'That sounds good.': 'यह अच्छा लग रहा है।', 'Sounds great.': 'बहुत अच्छा लग रहा है।',
  'That works for me.': 'यह मेरे लिए ठीक है।', 'I’m in.': 'मैं तैयार हूँ।', 'Maybe next time.': 'शायद अगली बार।',
  'I’d love to.': 'मुझे बहुत अच्छा लगेगा।', 'I’d rather not.': 'मैं ऐसा न करना पसंद करूँगा।',
  'It depends.': 'यह परिस्थिति पर निर्भर करता है।', 'By the way.': 'वैसे।', 'Actually.': 'दरअसल।',
  'I mean.': 'मेरा मतलब है।', 'For example.': 'उदाहरण के लिए।', 'To be honest.': 'सच कहूँ तो।',
  'As far as I know.': 'जहाँ तक मुझे पता है।', 'That’s interesting.': 'यह दिलचस्प है।', 'Really?': 'सच में?',
  'Are you serious?': 'क्या आप सच कह रहे हैं?', 'You’re right.': 'आप सही हैं।', 'I see.': 'अच्छा, समझा।',
  'Got it.': 'समझ गया / गई।', 'I understand.': 'मैं समझता / समझती हूँ।', 'I don’t understand.': 'मुझे समझ नहीं आया।',
  'Could you explain?': 'क्या आप समझा सकते हैं?', 'What do you think?': 'आपका क्या विचार है?',
  'How about you?': 'आपका क्या?', 'What about this?': 'इसके बारे में क्या?', 'Why not?': 'क्यों नहीं?',
  'Let’s do it.': 'चलो, करते हैं।', 'Let’s see.': 'देखते हैं।', 'I’m on my way.': 'मैं रास्ते में हूँ।',
  'I’ll be right back.': 'मैं अभी वापस आता / आती हूँ।', 'I’m running late.': 'मुझे देर हो रही है।',
  'No rush.': 'कोई जल्दी नहीं है।', 'Be careful.': 'सावधान रहना।', 'Good luck.': 'शुभकामनाएँ।',
  'Congratulations.': 'बधाई हो।', 'That’s too bad.': 'यह बहुत बुरा हुआ।', 'What a shame.': 'कितनी अफ़सोस की बात है।',
  'It doesn’t matter.': 'कोई फर्क नहीं पड़ता।', 'That’s fine.': 'यह ठीक है।', 'I’m just looking.': 'मैं बस देख रहा / रही हूँ।',
  'Can I ask you something?': 'क्या मैं आपसे कुछ पूछ सकता / सकती हूँ?', 'Would you mind?': 'क्या आपको एतराज़ होगा?',
  'It was my pleasure.': 'मुझे खुशी हुई।', 'Keep in touch.': 'संपर्क में रहिए।', 'Welcome back.': 'वापसी पर स्वागत है।',
  'Make yourself at home.': 'इसे अपना घर समझिए।', 'I’m glad to hear that.': 'यह सुनकर मुझे खुशी हुई।',
  'I hope so.': 'मुझे ऐसी उम्मीद है।', 'I hope not.': 'मुझे उम्मीद है कि ऐसा नहीं होगा।',
  home: 'घर', house: 'मकान', room: 'कमरा', door: 'दरवाज़ा', window: 'खिड़की', table: 'मेज़',
  chair: 'कुर्सी', bed: 'बिस्तर', kitchen: 'रसोई', bathroom: 'स्नानघर', key: 'चाबी', phone: 'फ़ोन',
  charger: 'चार्जर', bag: 'बैग', wallet: 'बटुआ', money: 'पैसा', card: 'कार्ड', clothes: 'कपड़े',
  shirt: 'कमीज़', shoes: 'जूते', coat: 'कोट', food: 'खाना', bread: 'रोटी', rice: 'चावल',
  water: 'पानी', milk: 'दूध', coffee: 'कॉफ़ी', tea: 'चाय', breakfast: 'नाश्ता', lunch: 'दोपहर का खाना',
  dinner: 'रात का खाना', snack: 'हल्का नाश्ता', fruit: 'फल', apple: 'सेब', banana: 'केला',
  vegetable: 'सब्ज़ी', egg: 'अंडा', cheese: 'पनीर / चीज़', store: 'दुकान', shop: 'दुकान',
  market: 'बाज़ार', price: 'कीमत', sale: 'छूट', receipt: 'रसीद', cash: 'नकद', change: 'बाकी पैसे / बदलाव',
  street: 'सड़क', road: 'रास्ता', corner: 'कोना', address: 'पता', map: 'नक्शा', bus: 'बस',
  train: 'ट्रेन', ticket: 'टिकट', station: 'स्टेशन', car: 'गाड़ी', bicycle: 'साइकिल',
  traffic: 'यातायात', trip: 'यात्रा', weather: 'मौसम', sun: 'सूरज', rain: 'बारिश', cloud: 'बादल',
  time: 'समय', day: 'दिन', week: 'सप्ताह', month: 'महीना', year: 'साल', morning: 'सुबह',
  afternoon: 'दोपहर', evening: 'शाम', weekend: 'सप्ताहांत', today: 'आज', tomorrow: 'कल',
  yesterday: 'बीता हुआ कल', work: 'काम', job: 'नौकरी', office: 'दफ़्तर', school: 'स्कूल',
  class: 'कक्षा', teacher: 'अध्यापक', student: 'विद्यार्थी', friend: 'दोस्त', family: 'परिवार',
  neighbor: 'पड़ोसी', child: 'बच्चा', parent: 'माता-पिता', doctor: 'डॉक्टर', appointment: 'मुलाक़ात का समय',
  health: 'स्वास्थ्य', medicine: 'दवा', problem: 'समस्या', question: 'सवाल', answer: 'जवाब',
  help: 'मदद', break: 'विराम', plan: 'योजना', idea: 'विचार', message: 'संदेश', email: 'ईमेल',
  meeting: 'बैठक', place: 'जगह', thing: 'चीज़', people: 'लोग', person: 'व्यक्ति', name: 'नाम',
  number: 'संख्या', story: 'कहानी', movie: 'फ़िल्म', music: 'संगीत', game: 'खेल', book: 'किताब',
  paper: 'कागज़', pen: 'कलम', computer: 'कंप्यूटर', internet: 'इंटरनेट', light: 'रोशनी',
  laundry: 'धुलाई', shower: 'नहाना / शॉवर', list: 'सूची', bottle: 'बोतल', cup: 'कप',
  plate: 'थाली', spoon: 'चम्मच', fork: 'काँटा', knife: 'चाकू', towel: 'तौलिया', soap: 'साबुन',
  clock: 'घड़ी', calendar: 'कैलेंडर', holiday: 'छुट्टी', birthday: 'जन्मदिन', party: 'पार्टी',
  gift: 'उपहार', photo: 'तस्वीर', garden: 'बगीचा', park: 'पार्क', library: 'पुस्तकालय',
  restaurant: 'रेस्तराँ', cafe: 'कैफ़े', bank: 'बैंक', hospital: 'अस्पताल', pharmacy: 'दवा की दुकान',
  airport: 'हवाई अड्डा', hotel: 'होटल', vacation: 'छुट्टियाँ', language: 'भाषा', word: 'शब्द',
  sentence: 'वाक्य', lesson: 'पाठ', practice: 'अभ्यास', sleep: 'नींद', exercise: 'व्यायाम',
  walk: 'टहलना', shopping: 'खरीदारी', cooking: 'खाना बनाना',
  be: 'होना', have: 'रखना / होना', do: 'करना', go: 'जाना', get: 'पाना / मिलना',
  make: 'बनाना', take: 'लेना', come: 'आना', ask: 'पूछना', answer: 'जवाब देना',
  add: 'जोड़ना', agree: 'सहमत होना', allow: 'अनुमति देना', arrive: 'पहुँचना', bake: 'बेक करना',
  begin: 'शुरू करना', believe: 'विश्वास करना', belong: 'संबंधित होना', borrow: 'उधार लेना',
  break: 'तोड़ना', bring: 'लाना', build: 'बनाना', buy: 'खरीदना', call: 'फ़ोन करना / बुलाना',
  carry: 'ले जाना', catch: 'पकड़ना', change: 'बदलना', choose: 'चुनना', clean: 'साफ़ करना',
  close: 'बंद करना', cook: 'खाना बनाना', count: 'गिनना', create: 'बनाना', cut: 'काटना',
  dance: 'नाचना', decide: 'फ़ैसला करना', describe: 'वर्णन करना', draw: 'चित्र बनाना',
  drink: 'पीना', drive: 'गाड़ी चलाना', eat: 'खाना', enjoy: 'आनंद लेना', explain: 'समझाना',
  fall: 'गिरना', feel: 'महसूस करना', find: 'खोजना', finish: 'पूरा करना', fix: 'ठीक करना',
  follow: 'अनुसरण करना', forget: 'भूलना', give: 'देना', grow: 'बढ़ना', happen: 'होना',
  hear: 'सुनना', hold: 'पकड़ना', hope: 'उम्मीद करना', invite: 'निमंत्रण देना', join: 'शामिल होना',
  keep: 'रखना', know: 'जानना', learn: 'सीखना', leave: 'छोड़ना / निकलना', lend: 'उधार देना',
  let: 'अनुमति देना', like: 'पसंद करना', listen: 'ध्यान से सुनना', live: 'रहना', look: 'देखना',
  lose: 'खोना', love: 'प्यार करना', mean: 'मतलब होना', meet: 'मिलना', miss: 'याद करना / चूकना',
  move: 'हिलना / जाना', need: 'ज़रूरत होना', notice: 'ध्यान देना', offer: 'पेशकश करना',
  open: 'खोलना', order: 'ऑर्डर करना', organize: 'व्यवस्थित करना', pay: 'भुगतान करना',
  play: 'खेलना', practice: 'अभ्यास करना', prefer: 'ज़्यादा पसंद करना', prepare: 'तैयार करना',
  promise: 'वादा करना', put: 'रखना', read: 'पढ़ना', remember: 'याद रखना', repeat: 'दोहराना',
  reply: 'जवाब देना', run: 'दौड़ना', say: 'कहना', see: 'देखना', sell: 'बेचना', send: 'भेजना',
  share: 'साझा करना', show: 'दिखाना', sit: 'बैठना', speak: 'बोलना', spend: 'खर्च करना / समय बिताना',
  stand: 'खड़ा होना', start: 'शुरू करना', stay: 'रुकना / ठहरना', stop: 'रोकना', study: 'पढ़ाई करना',
  suggest: 'सुझाव देना', teach: 'सिखाना', tell: 'बताना', think: 'सोचना', try: 'कोशिश करना',
  understand: 'समझना', use: 'इस्तेमाल करना', visit: 'मिलने जाना', wait: 'इंतज़ार करना',
  wake: 'जागना', walk: 'चलना', want: 'चाहना', watch: 'देखना', wear: 'पहनना', win: 'जीतना',
  write: 'लिखना', good: 'अच्छा', happy: 'खुश', easy: 'आसान', careful: 'सावधान',
  busy: 'व्यस्त', friendly: 'मिलनसार', comfortable: 'आरामदायक', important: 'महत्वपूर्ण',
  able: 'सक्षम', active: 'सक्रिय', afraid: 'डरा हुआ', amazing: 'शानदार', angry: 'नाराज़',
  annoyed: 'चिढ़ा हुआ', available: 'उपलब्ध', bad: 'बुरा', beautiful: 'सुंदर', better: 'बेहतर',
  big: 'बड़ा', bitter: 'कड़वा', black: 'काला', blue: 'नीला', boring: 'उबाऊ', brave: 'बहादुर',
  bright: 'चमकीला', calm: 'शांत', cheap: 'सस्ता', cheerful: 'प्रसन्न', clear: 'स्पष्ट',
  clever: 'होशियार', confident: 'आत्मविश्वासी', confused: 'उलझन में', convenient: 'सुविधाजनक',
  cool: 'ठंडा / शानदार', correct: 'सही', curious: 'जिज्ञासु', cute: 'प्यारा', dangerous: 'खतरनाक',
  dark: 'अँधेरा', delicious: 'स्वादिष्ट', different: 'अलग', difficult: 'मुश्किल', early: 'जल्दी',
  excited: 'उत्साहित', expensive: 'महँगा', fair: 'उचित', familiar: 'परिचित', famous: 'प्रसिद्ध',
  fantastic: 'बहुत बढ़िया', fast: 'तेज़', favorite: 'पसंदीदा', fine: 'ठीक', fun: 'मज़ेदार',
  funny: 'मज़ाकिया', gentle: 'नम्र', glad: 'खुश', great: 'बहुत अच्छा', green: 'हरा',
  hard: 'कठिन', healthy: 'स्वस्थ', helpful: 'मददगार', honest: 'ईमानदार', hot: 'गरम',
  kind: 'दयालु', large: 'बड़ा', late: 'देर', lazy: 'आलसी', light: 'हल्का', little: 'छोटा',
  local: 'स्थानीय', lonely: 'अकेला', long: 'लंबा', loud: 'ज़ोरदार', lucky: 'भाग्यशाली',
  modern: 'आधुनिक', natural: 'स्वाभाविक', necessary: 'ज़रूरी', nervous: 'घबराया हुआ',
  new: 'नया', nice: 'अच्छा', noisy: 'शोरगुल वाला', normal: 'सामान्य', old: 'पुराना',
  patient: 'धैर्यवान', peaceful: 'शांतिपूर्ण', perfect: 'उत्तम', personal: 'निजी',
  polite: 'विनम्र', popular: 'लोकप्रिय', possible: 'संभव', pretty: 'सुंदर', proud: 'गर्वित',
  quick: 'तेज़', quiet: 'शांत', ready: 'तैयार', real: 'असली', reasonable: 'उचित',
  relaxed: 'आराम से', rich: 'अमीर', right: 'सही', safe: 'सुरक्षित', sad: 'दुखी',
  same: 'एक जैसा', serious: 'गंभीर', short: 'छोटा', shy: 'शर्मीला', sick: 'बीमार',
  simple: 'सरल', slow: 'धीमा', small: 'छोटा', smart: 'समझदार', soft: 'नरम',
  special: 'खास', strong: 'मज़बूत', successful: 'सफल', sweet: 'मीठा', tall: 'लंबा',
  tasty: 'स्वादिष्ट', tired: 'थका हुआ', true: 'सच', useful: 'उपयोगी', warm: 'गर्म',
  weak: 'कमज़ोर', welcome: 'स्वागत योग्य', wet: 'गीला', white: 'सफेद', wonderful: 'शानदार',
  worried: 'चिंतित', young: 'जवान', usually: 'आमतौर पर', sometimes: 'कभी-कभी',
  already: 'पहले से', soon: 'जल्द', carefully: 'सावधानी से', quickly: 'जल्दी से',
  well: 'अच्छी तरह', too: 'बहुत ज़्यादा', about: 'के बारे में', above: 'ऊपर',
  absolutely: 'बिलकुल', almost: 'लगभग', always: 'हमेशा', away: 'दूर', badly: 'बुरी तरह',
  basically: 'मूल रूप से', certainly: 'निश्चित रूप से', clearly: 'स्पष्ट रूप से',
  closely: 'ध्यान से', comfortably: 'आराम से', completely: 'पूरी तरह', correctly: 'सही ढंग से',
  daily: 'रोज़ाना', definitely: 'निश्चित रूप से', easily: 'आसानी से', especially: 'खासकर',
  even: 'यहाँ तक कि', eventually: 'आखिरकार', ever: 'कभी', exactly: 'बिलकुल ठीक',
  finally: 'आखिर में', frequently: 'अक्सर', generally: 'आम तौर पर', gently: 'धीरे से',
  happily: 'खुशी से', hard: 'मेहनत से', here: 'यहाँ', honestly: 'ईमानदारी से',
  hopefully: 'उम्मीद है', immediately: 'तुरंत', inside: 'अंदर', instead: 'इसके बजाय',
  just: 'बस / अभी', kindly: 'कृपया', later: 'बाद में', maybe: 'शायद', mostly: 'ज़्यादातर',
  naturally: 'स्वाभाविक रूप से', nearly: 'लगभग', never: 'कभी नहीं', normally: 'सामान्यतः',
  now: 'अभी', occasionally: 'कभी-कभार', often: 'अक्सर', only: 'केवल', outside: 'बाहर',
  perfectly: 'बिलकुल ठीक', perhaps: 'शायद', politely: 'विनम्रता से', possibly: 'संभवतः',
  probably: 'शायद', quietly: 'चुपचाप', rarely: 'शायद ही कभी', really: 'वास्तव में',
  recently: 'हाल ही में', regularly: 'नियमित रूप से', sadly: 'दुख की बात है',
  safely: 'सुरक्षित रूप से', seriously: 'गंभीरता से', simply: 'सरलता से', slowly: 'धीरे-धीरे',
  straight: 'सीधे', suddenly: 'अचानक', surely: 'निश्चित रूप से', there: 'वहाँ',
  today: 'आज', together: 'साथ में', tomorrow: 'कल', very: 'बहुत', yesterday: 'कल',
  yet: 'अभी तक', forward: 'आगे', back: 'वापस', down: 'नीचे', up: 'ऊपर',
  far: 'दूर', near: 'पास', loudly: 'ज़ोर से', softly: 'धीरे से', strongly: 'मज़बूती से',
  weakly: 'कमज़ोरी से', eagerly: 'उत्सुकता से', fairly: 'काफ़ी', highly: 'बहुत',
  rather: 'कुछ हद तक', quite: 'काफ़ी', first: 'पहले', second: 'दूसरे', last: 'आखिर में',
  forever: 'हमेशा के लिए', currently: 'वर्तमान में', previously: 'पहले', shortly: 'जल्द',
  once: 'एक बार', twice: 'दो बार', weekly: 'साप्ताहिक', monthly: 'मासिक', yearly: 'सालाना',
  cost: 'कीमत होना', talk: 'बात करना', throw: 'फेंकना', turn: 'मोड़ना / घुमाना',
  care: 'देखभाल', comfort: 'आराम', success: 'सफलता', beauty: 'सुंदरता',
  difference: 'अंतर', decision: 'निर्णय', interest: 'रुचि',
  'Actually': 'दरअसल', Sure: 'ज़रूर', Maybe: 'शायद', 'By the way': 'वैसे',
  'I mean': 'मेरा मतलब है', 'That sounds good': 'यह अच्छा लगता है',
  'Could you…?': 'क्या आप ... कर सकते हैं?', 'I’m not sure': 'मुझे यक़ीन नहीं है',
  'That’s all right.': 'कोई बात नहीं', common: 'सामान्य',
  interested: 'रुचि रखने वाला / वाली', interesting: 'दिलचस्प', salty: 'नमकीन',
  also: 'भी', not: 'नहीं', still: 'अभी भी', somewhere: 'कहीं',
  anywhere: 'कहीं भी', everywhere: 'हर जगह', nowhere: 'कहीं नहीं',
  apart: 'अलग-अलग', around: 'आसपास', elsewhere: 'कहीं और',
  anxious: 'चिंतित', careless: 'लापरवाह', certain: 'निश्चित', creative: 'रचनात्मक',
  efficient: 'कुशल', equal: 'समान', exact: 'सटीक', faithful: 'वफ़ादार',
  final: 'अंतिम', fortunate: 'भाग्यशाली', free: 'स्वतंत्र / मुफ़्त',
  frequent: 'बार-बार होने वाला', full: 'भरा हुआ', general: 'सामान्य',
  grateful: 'आभारी', hopeful: 'आशावान', immediate: 'तत्काल',
  independent: 'स्वतंत्र', intelligent: 'बुद्धिमान', likely: 'संभावित',
  lively: 'जीवंत', main: 'मुख्य', major: 'प्रमुख', occasional: 'कभी-कभार होने वाला',
  official: 'आधिकारिक', powerful: 'शक्तिशाली', practical: 'व्यावहारिक',
  precise: 'सटीक', rapid: 'तेज़', rare: 'दुर्लभ', recent: 'हाल का',
  regular: 'नियमित', reliable: 'भरोसेमंद', sudden: 'अचानक', sure: 'निश्चित',
  surprising: 'हैरान करने वाला', swift: 'तेज़', terrible: 'भयानक',
  thankful: 'आभारी', thoughtful: 'विचारशील', typical: 'विशिष्ट',
  usual: 'सामान्य', wide: 'चौड़ा', wise: 'बुद्धिमान', wrong: 'गलत',
  heat: 'गर्मी', cleaning: 'सफ़ाई', habit: 'आदत', box: 'डिब्बा',
  brush: 'ब्रश', picture: 'तस्वीर', noise: 'शोर', closed: 'बंद'
};
const contextualHindiMeanings = {
  daily: { change: 'छुट्टे पैसे / बदलाव', answer: 'जवाब', break: 'विश्राम / विराम', open: 'खुला' },
  'word-families': {
    care: 'देखभाल', comfort: 'आराम', success: 'सफलता', beauty: 'सुंदरता',
    difference: 'अंतर', decision: 'निर्णय', interest: 'रुचि'
  }
};
const irregularVerbForms = {
  be: ['is', 'was / were', 'been', 'being'], begin: ['begins', 'began', 'begun', 'beginning'],
  break: ['breaks', 'broke', 'broken', 'breaking'], bring: ['brings', 'brought', 'brought', 'bringing'],
  build: ['builds', 'built', 'built', 'building'], buy: ['buys', 'bought', 'bought', 'buying'],
  catch: ['catches', 'caught', 'caught', 'catching'], choose: ['chooses', 'chose', 'chosen', 'choosing'],
  come: ['comes', 'came', 'come', 'coming'], cost: ['costs', 'cost', 'cost', 'costing'],
  cut: ['cuts', 'cut', 'cut', 'cutting'], do: ['does', 'did', 'done', 'doing'],
  draw: ['draws', 'drew', 'drawn', 'drawing'], drink: ['drinks', 'drank', 'drunk', 'drinking'],
  drive: ['drives', 'drove', 'driven', 'driving'], eat: ['eats', 'ate', 'eaten', 'eating'],
  fall: ['falls', 'fell', 'fallen', 'falling'], feel: ['feels', 'felt', 'felt', 'feeling'],
  find: ['finds', 'found', 'found', 'finding'], forget: ['forgets', 'forgot', 'forgotten', 'forgetting'],
  get: ['gets', 'got', 'got / gotten', 'getting'], give: ['gives', 'gave', 'given', 'giving'],
  go: ['goes', 'went', 'gone', 'going'], grow: ['grows', 'grew', 'grown', 'growing'],
  have: ['has', 'had', 'had', 'having'], hear: ['hears', 'heard', 'heard', 'hearing'],
  hold: ['holds', 'held', 'held', 'holding'], keep: ['keeps', 'kept', 'kept', 'keeping'],
  know: ['knows', 'knew', 'known', 'knowing'], leave: ['leaves', 'left', 'left', 'leaving'],
  lend: ['lends', 'lent', 'lent', 'lending'], let: ['lets', 'let', 'let', 'letting'],
  lose: ['loses', 'lost', 'lost', 'losing'], make: ['makes', 'made', 'made', 'making'],
  mean: ['means', 'meant', 'meant', 'meaning'], meet: ['meets', 'met', 'met', 'meeting'],
  pay: ['pays', 'paid', 'paid', 'paying'], put: ['puts', 'put', 'put', 'putting'],
  plan: ['plans', 'planned', 'planned', 'planning'], prefer: ['prefers', 'preferred', 'preferred', 'preferring'],
  shop: ['shops', 'shopped', 'shopped', 'shopping'], stop: ['stops', 'stopped', 'stopped', 'stopping'],
  read: ['reads', 'read', 'read', 'reading'], run: ['runs', 'ran', 'run', 'running'],
  say: ['says', 'said', 'said', 'saying'], see: ['sees', 'saw', 'seen', 'seeing'],
  sell: ['sells', 'sold', 'sold', 'selling'], send: ['sends', 'sent', 'sent', 'sending'],
  show: ['shows', 'showed', 'shown', 'showing'], sit: ['sits', 'sat', 'sat', 'sitting'],
  sleep: ['sleeps', 'slept', 'slept', 'sleeping'], speak: ['speaks', 'spoke', 'spoken', 'speaking'],
  spend: ['spends', 'spent', 'spent', 'spending'], stand: ['stands', 'stood', 'stood', 'standing'],
  take: ['takes', 'took', 'taken', 'taking'], teach: ['teaches', 'taught', 'taught', 'teaching'],
  tell: ['tells', 'told', 'told', 'telling'], think: ['thinks', 'thought', 'thought', 'thinking'],
  throw: ['throws', 'threw', 'thrown', 'throwing'], understand: ['understands', 'understood', 'understood', 'understanding'],
  wake: ['wakes', 'woke', 'woken', 'waking'], wear: ['wears', 'wore', 'worn', 'wearing'],
  win: ['wins', 'won', 'won', 'winning'], write: ['writes', 'wrote', 'written', 'writing']
};
const familyAdverbForms = {
  able: 'ably', angry: 'angrily', beautiful: 'beautifully', comfortable: 'comfortably',
  easy: 'easily', efficient: 'efficiently', friendly: 'in a friendly way', full: 'fully',
  fast: 'fast', good: 'well', happy: 'happily', hard: 'hard', healthy: 'healthily',
  heavy: 'heavily', likely: 'likely', late: 'late', early: 'early', straight: 'straight',
  daily: 'daily', weekly: 'weekly', monthly: 'monthly', yearly: 'yearly',
  lively: 'in a lively way', lonely: 'in a lonely way', lucky: 'luckily',
  natural: 'naturally', noisy: 'noisily', possible: 'possibly', pretty: 'prettily',
  quick: 'quickly', ready: 'readily', safe: 'safely', simple: 'simply',
  slow: 'slowly', special: 'specially', successful: 'successfully', true: 'truly',
  usual: 'usually', wonderful: 'wonderfully', wrong: 'wrongly'
};
const familyComparatives = {
  good: ['better', 'best'], bad: ['worse', 'worst'], far: ['farther / further', 'farthest / furthest'],
  little: ['less', 'least'], many: ['more', 'most'], much: ['more', 'most'],
  well: ['better', 'best'], old: ['older / elder', 'oldest / eldest']
};

function uniqueWords(key) {
  return [...new Set(vocabularyBanks[key].split('|').map((word) => word.trim()).filter(Boolean))];
}

function regularVerbForms(word) {
  const thirdPerson = word.endsWith('y') && !/[aeiou]y$/.test(word) ? `${word.slice(0, -1)}ies`
    : /(s|sh|ch|x|z|o)$/.test(word) ? `${word}es` : `${word}s`;
  const past = word.endsWith('e') ? `${word}d`
    : word.endsWith('y') && !/[aeiou]y$/.test(word) ? `${word.slice(0, -1)}ied` : `${word}ed`;
  const ing = word.endsWith('ie') ? `${word.slice(0, -2)}ying`
    : word.endsWith('e') && !word.endsWith('ee') ? `${word.slice(0, -1)}ing` : `${word}ing`;
  return [thirdPerson, past, past, ing];
}

function adverbForm(word) {
  if (familyAdverbForms[word]) return familyAdverbForms[word];
  if (word.endsWith('y')) return `${word.slice(0, -1)}ily`;
  if (word.endsWith('le')) return `${word.slice(0, -2)}ly`;
  if (word.endsWith('ic')) return `${word}ally`;
  return `${word}ly`;
}

function adjectiveForms(word) {
  if (familyComparatives[word]) return familyComparatives[word];
  if (word.length > 8 || /ful|ous|ive|able|ible|ing|ed$/.test(word)) {
    return [`more ${word}`, `most ${word}`];
  }
  if (word.endsWith('y')) return [`${word.slice(0, -1)}ier`, `${word.slice(0, -1)}iest`];
  if (word.endsWith('e')) return [`${word}r`, `${word}st`];
  if (/^[a-z]{3,4}$/.test(word) && /[^aeiou][aeiou][^aeiouwxy]$/.test(word)) {
    return [`${word}${word.at(-1)}er`, `${word}${word.at(-1)}est`];
  }
  return [`${word}er`, `${word}est`];
}

const vocabularySubtopicWords = {
  daily: {
    'At home': 'home house room door window table chair bed kitchen bathroom key charger clothes shirt shoes coat cup plate spoon fork knife towel soap laundry shower',
    'Food & meals': 'food bread rice water milk coffee tea breakfast lunch dinner snack fruit apple banana vegetable egg cheese restaurant cafe cooking',
    'Shopping & money': 'store shop market price sale receipt cash change wallet money card shopping bank',
    'Travel & places': 'street road corner address map bus train ticket station car bicycle traffic trip airport hotel vacation park library hospital pharmacy',
    'Time & routine': 'time day week month year morning afternoon evening weekend today tomorrow yesterday clock calendar holiday habit sleep exercise walk',
    'People & health': 'friend family neighbor child parent teacher student doctor appointment health medicine people person',
    'Work & learning': 'work job office school class teacher student meeting email message computer internet language word sentence lesson practice book paper pen',
    'Everyday things': 'break plan idea place thing name number story movie music game light heat list bottle brush gift photo picture garden birthday party'
  },
  conversation: {
    'Greetings & introductions': 'How are you?|How’s it going?|Nice to meet you.|Good to see you.|Good morning.|Good afternoon.|Good evening.|Welcome back.',
    'Polite expressions': 'Please.|Thank you.|Thanks a lot.|You’re welcome.|Excuse me.|Pardon me.|Would you mind?|It was my pleasure.',
    'Replies & reactions': 'Not bad.|Pretty good.|Of course.|No problem.|Absolutely.|Definitely.|I agree.|I disagree.|That’s right.|Exactly.|Really?|I see.|Got it.',
    'Requests & help': 'Could you help me?|Could you repeat that?|Could you speak slowly?|Could you explain?|Can I ask you something?',
    'Conversation phrases': 'By the way.|Actually.|I mean.|For example.|To be honest.|As far as I know.|It depends.|Let’s see.'
  },
  verbs: {
    'Home & daily routines': 'bake be begin clean close cook do drink eat finish get have make prepare put read sleep start stay stop wash wake wear',
    'Communication & learning': 'answer ask describe explain hear know learn listen mean read remember repeat reply say share show speak study teach tell think understand write',
    'Movement & travel': 'arrive bring carry catch come drive fall follow go leave meet move run sit stand take travel visit wait walk',
    'Work & tasks': 'add allow borrow break build buy change choose create cut decide draw fix give hold keep lend let lose organize pay plan play practice promise send sell spend suggest try use win',
    'Feelings & relationships': 'agree believe enjoy feel help hope invite join like love miss notice offer prefer want'
  },
  adjectives: {
    'Feelings & personality': 'afraid angry annoyed brave calm cheerful confident confused curious excited glad happy honest kind lazy lonely lucky nervous patient peaceful proud relaxed sad serious shy tired worried',
    'Size, appearance & color': 'big black blue bright dark green large light little long pretty short small tall white young',
    'Quality & condition': 'able available bad beautiful better bitter careful cheap clean clear comfortable correct dangerous delicious different difficult easy expensive familiar fantastic fast good great healthy helpful important modern natural necessary new nice normal perfect polite possible quick quiet real safe same simple slow smart special strong successful useful warm weak wonderful'
  },
  adverbs: {
    'Time & frequency': 'already always daily early eventually ever finally frequently later monthly never now occasionally often rarely recently regularly soon sometimes today tomorrow usually weekly yesterday yet',
    'Manner': 'badly carefully clearly closely comfortably completely correctly easily gently happily honestly kindly loudly politely quickly quietly safely seriously simply slowly softly strongly suddenly well',
    'Place & direction': 'above away back down forward here inside near outside somewhere there up anywhere everywhere nowhere',
    'Degree & viewpoint': 'absolutely almost also basically certainly definitely especially exactly just maybe mostly nearly only perhaps possibly probably quite rather really too very hopefully'
  }
};
const hindiExampleSentences = {
  'How are you?': 'आप कैसे हैं?', 'Nice to meet you.': 'आपसे मिलकर अच्छा लगा।',
  'Could you help me?': 'क्या आप मेरी मदद कर सकते हैं?', 'That sounds good.': 'यह अच्छा लग रहा है।',
  be: 'मैं आज घर पर हूँ।', have: 'मेरे पास एक मिनट है।', do: 'मैं हर दिन अपना काम करता / करती हूँ।',
  go: 'मैं रोज़ काम पर जाता / जाती हूँ।', get: 'मुझे आपका संदेश मिल गया।',
  make: 'मैं चाय बना रहा / रही हूँ।', take: 'बस से लगभग दस मिनट लगते हैं।',
  come: 'क्या आप आज रात आ रहे हैं?', ask: 'क्या मैं आपसे एक सवाल पूछ सकता / सकती हूँ?',
  answer: 'कृपया मेरे सवाल का जवाब दीजिए।', call: 'मैं आपको बाद में फ़ोन करूँगा / करूँगी।',
  eat: 'हमने साथ में खाना खाया।', drink: 'दिन भर पानी पीते रहें।', cook: 'वह आज रात खाना बना रही है।',
  help: 'क्या आप मेरी मदद कर सकते हैं?', work: 'वह घर से काम करती है।',
  friend: 'मेरा दोस्त पास में रहता है।', family: 'मेरा परिवार दिल्ली में रहता है।',
  home: 'मैं शाम को घर आऊँगा / आऊँगी।', food: 'यह खाना बहुत स्वादिष्ट है।',
  water: 'क्या मुझे थोड़ा पानी मिल सकता है?', coffee: 'मैं सुबह कॉफ़ी पीता / पीती हूँ।',
  tea: 'चाय तैयार है।', breakfast: 'मैंने नाश्ता कर लिया है।', dinner: 'रात का खाना सात बजे तैयार होगा।',
  bus: 'बस पाँच मिनट में आएगी।', train: 'हमारी ट्रेन समय पर है।', ticket: 'आपका टिकट कहाँ है?',
  phone: 'मेरा फ़ोन बैग में है।', money: 'मेरे पास नकद पैसे नहीं हैं।', shop: 'दुकान नौ बजे खुलती है।',
  market: 'हम बाज़ार जा रहे हैं।', doctor: 'मुझे डॉक्टर से मिलना है।',
  happy: 'आज मैं बहुत खुश हूँ।', busy: 'मैं आज दोपहर व्यस्त हूँ।',
  good: 'यह एक अच्छा विचार है।', easy: 'यह सवाल आसान है।', careful: 'सड़क पार करते समय सावधान रहें।',
  carefully: 'कृपया गाड़ी सावधानी से चलाएँ।', quickly: 'कृपया जल्दी तैयार हो जाइए।',
  well: 'वह अंग्रेज़ी अच्छी तरह बोलती है।', usually: 'मैं आमतौर पर बस से काम पर जाता / जाती हूँ।',
  sometimes: 'हम कभी-कभी साथ में खाना बनाते हैं।', soon: 'बस जल्द ही यहाँ होगी।',
  today: 'आज मौसम अच्छा है।', tomorrow: 'मैं कल आपको फ़ोन करूँगा / करूँगी।'
};
const dailyVerbWords = new Set(uniqueWords('verbs'));
const dailyAdjectiveWords = new Set(uniqueWords('adjectives'));
const dailyAdverbWords = new Set(uniqueWords('adverbs'));
const vocabularyGroupSets = Object.fromEntries(
  Object.entries(vocabularySubtopicWords).map(([category, groups]) => [
    category,
    Object.fromEntries(Object.entries(groups).map(([label, words]) => [label, new Set(category === 'conversation' ? words.split('|') : words.split(/\s+/u))]))
  ])
);

function vocabularyPartOfSpeech(topic, word, forms = []) {
  if (topic.id === 'verbs') return 'verb';
  if (topic.id === 'adjectives') return 'adjective';
  if (topic.id === 'adverbs') return 'adverb';
  if (topic.id === 'conversation') return 'phrase';
  if (topic.id === 'word-families') return 'word family';
  if (dailyVerbWords.has(word)) return 'verb';
  if (dailyAdjectiveWords.has(word)) return 'adjective';
  if (dailyAdverbWords.has(word)) return 'adverb';
  if (forms.some(([name]) => name.toLocaleLowerCase() === 'verb')) return 'verb';
  return 'noun';
}

function vocabularySubtopic(topic, word) {
  const groups = vocabularyGroupSets[topic.id];
  if (groups) {
    const match = Object.entries(groups).find(([, words]) => words.has(word));
    if (match) return match[0];
  }
  const fallback = {
    conversation: 'Everyday expressions',
    verbs: 'Other common verbs',
    adjectives: 'Other descriptions',
    adverbs: 'Other useful adverbs',
    'word-families': 'Common word families',
    daily: 'Everyday things'
  };
  return fallback[topic.id];
}

function addVocabularyDetails() {
  vocabularyTopics.forEach((topic) => {
    topic.words.forEach((item) => {
      item.pos = vocabularyPartOfSpeech(topic, item.word, item.forms || []);
      item.subtopic = vocabularySubtopic(topic, item.word);
      item.hindi = item.hindi || contextualHindiMeanings[topic.id]?.[item.word] || hindiMeanings[item.word] || '';
      item.hindiExample = item.hindiExample || hindiExampleSentences[item.word] || '';
      item.chineseMeaning = window.saysoTranslations.meanings[item.word] || '';
      item.chineseExample = window.saysoTranslations.examples[item.word] || '';
    });
  });
}

function expandVocabularyBanks() {
  const bankByTopic = {
    conversation: 'conversation', verbs: 'verbs', adjectives: 'adjectives',
    adverbs: 'adverbs', 'word-families': 'families', daily: 'daily'
  };
  vocabularyTopics.forEach((topic) => {
    const existing = new Set(topic.words.map((item) => item.word.toLocaleLowerCase()));
    uniqueWords(bankByTopic[topic.id]).forEach((word) => {
      if (existing.has(word.toLocaleLowerCase())) return;
      existing.add(word.toLocaleLowerCase());
      let item = { word, type: 'Everyday vocabulary' };
      if (topic.id === 'conversation') {
        item = { ...item, type: 'Useful conversation expression', example: word };
      } else if (topic.id === 'verbs') {
        const [thirdPerson, past, participle, ing] = irregularVerbForms[word] || regularVerbForms(word);
        item = {
          ...item,
          type: 'Common action or state',
          forms: [['Base', word], ['He / she', thirdPerson], ['Past', past], ['Past participle', participle], ['-ing', ing]]
        };
      } else if (topic.id === 'adjectives') {
        const [comparative, superlative] = adjectiveForms(word);
        item = {
          ...item,
          type: 'Describes a person, place, or thing',
          forms: [['Comparative', comparative], ['Superlative', superlative], ['Related adverb', adverbForm(word)]]
        };
      } else if (topic.id === 'adverbs') {
        item = {
          ...item,
          type: 'Adds detail about how, when, where, or how often',
          forms: [['Word type', 'Adverb']]
        };
      } else if (topic.id === 'word-families') {
        const [comparative, superlative] = adjectiveForms(word);
        item = {
          ...item,
          type: 'Adjective and related word forms',
          forms: [['Adjective', word], ['Adverb', adverbForm(word)], ['Comparative', comparative], ['Superlative', superlative]]
        };
      } else if (topic.id === 'daily') {
        item = { ...item, type: 'Common word for daily life' };
      }
      topic.words.push(item);
    });
  });
  addVocabularyDetails();
}

expandVocabularyBanks();

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function selectView(view) {
  const labels = { grammar: t('Grammar guide'), vocabulary: t('Vocabulary') };
  const selectedView = labels[view] ? view : 'grammar';
  document.querySelectorAll('.view').forEach((section) => {
    section.hidden = section.id !== `${selectedView}-view`;
  });
  $('#page-label').textContent = labels[selectedView];
  document.querySelectorAll('.nav-item').forEach((item) => {
    const active = item.dataset.view === selectedView;
    item.classList.toggle('is-active', active);
    if (active) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
  if (selectedView === 'grammar') renderGrammarLevel(activeGrammarLevel);
}

function renderVocabularyTopic(topicId) {
  const topic = vocabularyTopics.find((item) => item.id === topicId) || vocabularyTopics[0];
  const previousTopicId = activeVocabularyTopicId;
  activeVocabularyTopicId = topic.id;
  const tabs = $('#vocabulary-tabs');
  const content = $('#vocabulary-content');
  const search = $('#vocabulary-search').value.trim().toLocaleLowerCase();
  const subtopics = [...new Set(topic.words.map((item) => item.subtopic))].sort((first, second) => first.localeCompare(second));
  const subtopicSelect = $('#vocabulary-subtopic');
  if (previousTopicId !== topic.id || !subtopics.includes(activeVocabularySubtopic)) activeVocabularySubtopic = 'all';
  subtopicSelect.replaceChildren(new Option(t('All subtopics'), 'all'));
  subtopics.forEach((subtopic) => subtopicSelect.add(new Option(t(subtopic), subtopic)));
  subtopicSelect.value = activeVocabularySubtopic;
  const filteredWords = topic.words.filter((item) => {
    const searchable = [item.word, item.type, item.subtopic, item.chineseMeaning, item.chineseExample, item.example, item.note, ...(item.forms || []).flat()].join(' ').toLocaleLowerCase();
    const formMatches = activeVocabularyPartOfSpeech === 'all'
      || item.pos === activeVocabularyPartOfSpeech
      || (item.pos === 'word family' && (item.forms || []).some(([name]) => name.toLocaleLowerCase() === activeVocabularyPartOfSpeech));
    return searchable.includes(search)
      && (activeVocabularySubtopic === 'all' || item.subtopic === activeVocabularySubtopic)
      && formMatches;
  });
  $('#vocabulary-count').textContent = `显示 ${filteredWords.length} / ${topic.words.length} 个词`;
  tabs.replaceChildren();
  vocabularyTopics.forEach((item) => {
    const tab = document.createElement('button');
    tab.className = 'grammar-tab';
    tab.type = 'button';
    tab.id = `vocabulary-tab-${item.id}`;
    tab.role = 'tab';
    tab.setAttribute('aria-controls', 'vocabulary-content');
    tab.setAttribute('aria-selected', String(item.id === topic.id));
    tab.tabIndex = item.id === topic.id ? 0 : -1;
    tab.textContent = `${t(item.label)} (${item.words.length})`;
    tab.addEventListener('click', () => renderVocabularyTopic(item.id));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const currentIndex = vocabularyTopics.findIndex((candidate) => candidate.id === item.id);
      const nextIndex = event.key === 'Home' ? 0
        : event.key === 'End' ? vocabularyTopics.length - 1
          : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + vocabularyTopics.length) % vocabularyTopics.length;
      renderVocabularyTopic(vocabularyTopics[nextIndex].id);
      $(`#vocabulary-tab-${vocabularyTopics[nextIndex].id}`).focus();
    });
    tabs.append(tab);
  });

  content.setAttribute('aria-labelledby', `vocabulary-tab-${topic.id}`);
  content.replaceChildren();
  const title = document.createElement('h2');
  title.className = 'grammar-topic-title';
  title.textContent = t(topic.title);
  const intro = document.createElement('p');
  intro.className = 'grammar-topic-intro';
  intro.textContent = t(topic.intro);
  const words = document.createElement('div');
  words.className = 'vocabulary-grid';
  filteredWords.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'vocabulary-card';
    const heading = document.createElement('div');
    heading.className = 'vocabulary-card-heading';
    const word = document.createElement('h3');
    word.className = 'vocabulary-word';
    word.textContent = item.word;
    const type = document.createElement('span');
    type.className = 'vocabulary-type';
    type.textContent = t(item.type);
    heading.append(word, type);

    const formsList = item.forms || [];
    const exampleForm = formsList.find(([label]) => label === 'Example');
    const forms = document.createElement('dl');
    forms.className = 'vocabulary-forms';
    formsList.filter(([label]) => label !== 'Example').forEach(([label, value]) => {
      const row = document.createElement('div');
      row.className = 'vocabulary-form';
      const term = document.createElement('dt');
      term.textContent = t(label);
      const definition = document.createElement('dd');
      definition.textContent = t(value);
      row.append(term, definition);
      forms.append(row);
    });

    const example = item.example || exampleForm?.[1];
    const useGenericExample = !example;
    card.append(heading);
    const meaning = document.createElement('p');
    meaning.className = 'vocabulary-meaning';
    meaning.lang = 'zh-CN';
    meaning.textContent = `释义：${item.chineseMeaning || '暂无中文释义。'}`;
    card.append(meaning);
    if (forms.childElementCount) card.append(forms);
    const exampleText = document.createElement('p');
    exampleText.className = 'vocabulary-example';
    exampleText.textContent = useGenericExample
      ? `日常英语中可以这样使用：“${item.word}”。`
      : `“${example}”`;
    card.append(exampleText);
    if (item.chineseExample || useGenericExample) {
      const translatedExample = document.createElement('p');
      translatedExample.className = 'vocabulary-hindi-example';
      translatedExample.lang = 'zh-CN';
      translatedExample.textContent = useGenericExample
        ? `例句：你可以在日常英语中使用“${item.word}”。`
        : `例句：“${item.chineseExample}”`;
      card.append(translatedExample);
    }
    if (item.note) {
      const note = document.createElement('p');
      note.className = 'grammar-example-note';
      note.textContent = t(item.note);
      card.append(note);
    }
    words.append(card);
  });
  if (filteredWords.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'vocabulary-empty';
    empty.textContent = t('No matching words. Try another search.');
    words.append(empty);
  }
  content.append(title, intro, words);
}

function renderGrammarLevel(level) {
  activeGrammarLevel = level;
  const levels = ['Basic', 'Elementary', 'Intermediate'];
  const levelTabs = $('#grammar-level-tabs');
  levelTabs.replaceChildren();
  levels.forEach((item, index) => {
    const button = document.createElement('button');
    button.className = 'grammar-level-tab';
    button.type = 'button';
    button.id = `grammar-level-${item.toLocaleLowerCase()}`;
    button.role = 'tab';
    button.setAttribute('aria-selected', String(item === level));
    button.tabIndex = item === level ? 0 : -1;
    button.textContent = t(item);
    button.addEventListener('click', () => renderGrammarLevel(item));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === 'Home' ? 0
        : event.key === 'End' ? levels.length - 1
          : (index + (event.key === 'ArrowRight' ? 1 : -1) + levels.length) % levels.length;
      renderGrammarLevel(levels[nextIndex]);
      $(`#grammar-level-${levels[nextIndex].toLocaleLowerCase()}`).focus();
    });
    levelTabs.append(button);
  });

  const topics = grammarTopics.filter((topic) => topic.id === 'tenses' || grammarTopicLevels[topic.id]?.includes(level));
  if (!topics.some((topic) => topic.id === activeGrammarTopicId)) activeGrammarTopicId = topics[0].id;
  const tabs = $('#grammar-tabs');
  tabs.replaceChildren();
  topics.forEach((item, index) => {
    const tab = document.createElement('button');
    tab.className = 'grammar-tab';
    tab.type = 'button';
    tab.id = `grammar-tab-${item.id}`;
    tab.role = 'tab';
    tab.setAttribute('aria-controls', 'grammar-content');
    tab.setAttribute('aria-selected', String(item.id === activeGrammarTopicId));
    tab.tabIndex = item.id === activeGrammarTopicId ? 0 : -1;
    tab.textContent = t(item.label);
    tab.addEventListener('click', () => {
      activeGrammarTopicId = item.id;
      renderGrammarLevel(activeGrammarLevel);
    });
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === 'Home' ? 0
        : event.key === 'End' ? topics.length - 1
          : (index + (event.key === 'ArrowRight' ? 1 : -1) + topics.length) % topics.length;
      activeGrammarTopicId = topics[nextIndex].id;
      renderGrammarLevel(activeGrammarLevel);
      $(`#grammar-tab-${topics[nextIndex].id}`).focus();
    });
    tabs.append(tab);
  });
  renderGrammarTopic(activeGrammarTopicId);
}

function appendExercise(content, exercise, id) {
  const section = document.createElement('section');
  section.className = 'grammar-exercise';
  section.setAttribute('aria-labelledby', `exercise-title-${id}`);
  const heading = document.createElement('div');
  heading.className = 'exercise-heading';
  const title = document.createElement('h3');
  title.id = `exercise-title-${id}`;
  title.textContent = t('Quick practice');
  const hint = document.createElement('span');
  hint.textContent = t('Choose one answer');
  heading.append(title, hint);
  const prompt = document.createElement('p');
  prompt.className = 'exercise-prompt';
  prompt.textContent = t(exercise.prompt || exercise.question);
  const options = document.createElement('div');
  options.className = 'exercise-options';
  options.setAttribute('role', 'group');
  options.setAttribute('aria-label', t('Answer choices'));
  const feedback = document.createElement('p');
  feedback.className = 'exercise-feedback';
  feedback.setAttribute('aria-live', 'polite');
  exercise.choices.forEach((choice) => {
    const button = document.createElement('button');
    button.className = 'exercise-option';
    button.type = 'button';
    button.textContent = choice;
    button.addEventListener('click', () => {
      const isCorrect = choice === exercise.answer;
      options.querySelectorAll('button').forEach((option) => {
        option.disabled = true;
        if (option.textContent === exercise.answer) option.classList.add('is-correct');
      });
      if (!isCorrect) button.classList.add('is-incorrect');
      feedback.classList.toggle('is-correct', isCorrect);
      feedback.textContent = `${isCorrect ? '回答正确！' : `再试一次。正确答案是“${exercise.answer}”。`} ${t(exercise.feedback)}`;
    });
    options.append(button);
  });
  section.append(heading, prompt, options, feedback);
  content.append(section);
}

function renderTenseLesson(lesson) {
  const content = $('#grammar-content');
  const title = document.createElement('h2');
  title.className = 'grammar-topic-title';
  title.textContent = t(lesson.title);
  const level = document.createElement('span');
  level.className = 'lesson-level';
  level.textContent = t(`${lesson.level} level`);
  const patternLabel = document.createElement('h3');
  patternLabel.className = 'lesson-section-heading';
  patternLabel.textContent = t('Form');
  const pattern = document.createElement('p');
  pattern.className = 'lesson-rule';
  pattern.textContent = t(lesson.pattern);
  const useLabel = document.createElement('h3');
  useLabel.className = 'lesson-section-heading';
  useLabel.textContent = t('When to use it');
  const use = document.createElement('p');
  use.className = 'grammar-topic-intro lesson-use';
  use.textContent = t(lesson.use);
  const examples = document.createElement('div');
  examples.className = 'grammar-examples';
  lesson.examples.forEach((sentence, index) => {
    const card = document.createElement('article');
    card.className = 'grammar-example';
    const label = document.createElement('span');
    label.className = 'grammar-example-label';
    label.textContent = `日常例句 ${index + 1}`;
    const sample = document.createElement('p');
    sample.className = 'grammar-example-sentence';
    sample.textContent = `“${sentence}”`;
    card.append(label, sample);
    examples.append(card);
  });
  const mistakeLabel = document.createElement('h3');
  mistakeLabel.className = 'lesson-section-heading';
  mistakeLabel.textContent = t('Common mistake to avoid');
  const mistake = document.createElement('p');
  mistake.className = 'lesson-mistake';
  mistake.textContent = t(lesson.mistake);
  content.append(title, level, patternLabel, pattern, useLabel, use, examples, mistakeLabel, mistake);
  appendExercise(content, lesson, lesson.id);
}

function renderGrammarTopic(topicId) {
  const topic = grammarTopics.find((item) => item.id === topicId) || grammarTopics[0];
  const content = $('#grammar-content');
  const tenseTabs = $('#tense-tabs');
  activeGrammarTopicId = topic.id;
  content.replaceChildren();
  tenseTabs.replaceChildren();
  tenseTabs.hidden = topic.id !== 'tenses';
  content.setAttribute('aria-labelledby', `grammar-tab-${topic.id}`);

  if (topic.id === 'tenses') {
    const lessons = tenseLessons.filter((lesson) => lesson.level === activeGrammarLevel);
    if (!lessons.some((lesson) => lesson.id === activeTenseLessonId)) activeTenseLessonId = lessons[0].id;
    lessons.forEach((lesson, index) => {
      const tab = document.createElement('button');
      tab.className = 'grammar-tab tense-tab';
      tab.type = 'button';
      tab.id = `tense-tab-${lesson.id}`;
      tab.role = 'tab';
      tab.setAttribute('aria-controls', 'grammar-content');
      tab.setAttribute('aria-selected', String(lesson.id === activeTenseLessonId));
      tab.tabIndex = lesson.id === activeTenseLessonId ? 0 : -1;
      tab.textContent = t(lesson.title);
      tab.addEventListener('click', () => {
        activeTenseLessonId = lesson.id;
        renderGrammarTopic('tenses');
      });
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const nextIndex = event.key === 'Home' ? 0
          : event.key === 'End' ? lessons.length - 1
            : (index + (event.key === 'ArrowRight' ? 1 : -1) + lessons.length) % lessons.length;
        activeTenseLessonId = lessons[nextIndex].id;
        renderGrammarTopic('tenses');
        $(`#tense-tab-${lessons[nextIndex].id}`).focus();
      });
      tenseTabs.append(tab);
    });
    renderTenseLesson(lessons.find((lesson) => lesson.id === activeTenseLessonId));
    return;
  }

  const title = document.createElement('h2');
  title.className = 'grammar-topic-title';
  title.textContent = t(topic.title);
  const level = document.createElement('span');
  level.className = 'lesson-level';
  level.textContent = t(`${activeGrammarLevel} level`);
  const intro = document.createElement('p');
  intro.className = 'grammar-topic-intro';
  intro.textContent = t(topic.intro);
  const examples = document.createElement('div');
  examples.className = 'grammar-examples';
  topic.examples.forEach((example) => {
    const card = document.createElement('article');
    card.className = 'grammar-example';
    const label = document.createElement('span');
    label.className = 'grammar-example-label';
    label.textContent = t(example.label);
    const sentence = document.createElement('p');
    sentence.className = 'grammar-example-sentence';
    sentence.textContent = `“${example.sentence}”`;
    const note = document.createElement('p');
    note.className = 'grammar-example-note';
    note.textContent = t(example.note);
    card.append(label, sentence, note);
    examples.append(card);
  });
  content.append(title, level, intro, examples);
  const exercise = grammarExercises[topic.id];
  if (exercise) appendExercise(content, exercise, topic.id);
}

document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => selectView(button.dataset.view)));
renderGrammarLevel(activeGrammarLevel);
renderVocabularyTopic('conversation');
$('#vocabulary-search').addEventListener('input', () => renderVocabularyTopic(activeVocabularyTopicId));
$('#vocabulary-subtopic').addEventListener('change', (event) => {
  activeVocabularySubtopic = event.target.value;
  renderVocabularyTopic(activeVocabularyTopicId);
});
$('#vocabulary-part-of-speech').addEventListener('change', (event) => {
  activeVocabularyPartOfSpeech = event.target.value;
  renderVocabularyTopic(activeVocabularyTopicId);
});
refreshIcons();
