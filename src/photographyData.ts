import { PhotoTerm, QuizChallenge } from './types';

export const PHOTOGRAPHY_CATEGORIES = {
  lenses: {
    title: "Lenses & Focal Lengths",
    description: "Optics shape depth, field of view, and subjective emotion. Choose standard prime, telephoto, wide-angle, or cinematic anamorphic lenses to focus your scene.",
    color: "bg-amber-50 text-amber-900 border-amber-200"
  },
  angles: {
    title: "Camera Angles",
    description: "Camera height and tilt change the viewer's psychological connection to the subject, conveying dominance, vulnerability, or instability.",
    color: "bg-blue-50 text-blue-900 border-blue-200"
  },
  framing: {
    title: "Shot Framing (Scale)",
    description: "Framing dictates how much of the subject and surroundings are seen, choosing between epic scale, human action, or intense emotion.",
    color: "bg-indigo-50 text-indigo-900 border-indigo-200"
  },
  lighting: {
    title: "Lighting Setups & Atmosphere",
    description: "Light creates drama, textures, shadows, and mood. Master professional studio setups, directional qualities, and atmospheric effects.",
    color: "bg-emerald-50 text-emerald-900 border-emerald-200"
  },
  movements: {
    title: "Camera Movements (Motion)",
    description: "Essential for AI video prompting. Orchestrate camera motion to guide the viewer, build suspense, or transition dynamically.",
    color: "bg-purple-50 text-purple-900 border-purple-200"
  },
  'color-film': {
    title: "Film Stocks & Color Grading",
    description: "Tonalities, grain characteristics, and professional color grades define the vintage period or artistic style of your visual.",
    color: "bg-rose-50 text-rose-900 border-rose-200"
  }
};

export const PHOTOGRAPHY_TERMS: PhotoTerm[] = [
  // --- Lenses ---
  {
    id: "lens-anamorphic",
    name: "Anamorphic Lens",
    category: "lenses",
    definition: "A lens designed to squeeze a wider image onto a standard sensor, creating a cinematic ultra-wide aspect ratio with elliptical bokeh and horizontal lens flares.",
    visualType: "lens-anamorphic",
    promptSnippets: {
      image: "shot on anamorphic lens, 2.39:1 ratio, horizontal blue streak lens flares, oval bokeh, cinematographic depth of field",
      video: "filmed on cinematic anamorphic glass, dramatic blue lens flares stretching horizontally as the highlight light source crosses the frame"
    },
    promptTemplate: "shot on anamorphic lens, wide cinematic aspect ratio, horizontal streak flares",
    tip: "Perfect for sci-fi, epic landscapes, or night cityscapes. Mention 'oval bokeh' and 'horizontal lens flares' to activate the distinct look.",
    expertInsight: "Anamorphic lenses were created to fit widescreen cinema on 35mm film. They have a cinematic softness and organic look that digital lenses lack."
  },
  {
    id: "lens-wide-14mm",
    name: "14mm Ultra-Wide Angle",
    category: "lenses",
    definition: "An extremely wide focal length that offers a vast view, distorting straight lines near the margins and magnifying the distance between objects.",
    visualType: "lens-wide",
    promptSnippets: {
      image: "shot on 14mm ultra-wide angle lens, expansive perspective, dramatic visual distortion, spacious frame",
      video: "fast tracking wide shot, 14mm focal length, exaggerated deep background depth, fast-growing perspective"
    },
    promptTemplate: "14mm ultra-wide-angle lens, expansive deep perspective",
    tip: "Ideal for colossal architecture, boundless canyon expanses, or making cramped interior rooms look massive. Use to exaggerate depth.",
    expertInsight: "Wide focal lengths emphasize the foreground subject while pushing the background far away. It evokes high kineticism or isolation."
  },
  {
    id: "lens-portrait-85mm",
    name: "85mm Portrait Prime",
    category: "lenses",
    definition: "The classic focal length for portraits. It compresses facial features naturally without distortion, separating the subject from a creamy, blurred background.",
    visualType: "lens-portrait",
    promptSnippets: {
      image: "shot on 85mm prime lens, tight key-focus, creamy shallow depth of field, f/1.4 blur background, focused facial features",
      video: "slow emotional focus pull, close-up tracking, 85mm lens compression, beautiful headshot portrait bokeh"
    },
    promptTemplate: "shot on 85mm portrait lens, f/1.4 aperture, creamy bokeh",
    tip: "Combine with 'f/1.4 aperture' and 'creamy background bokeh' for absolute isolation of your human, animal, or object subjects.",
    expertInsight: "85mm offers comfortable working distance, giving portraits an intimate yet objective perspective, completely free of lens distortion."
  },
  {
    id: "lens-telephoto-200mm",
    name: "200mm Telephoto Lens",
    category: "lenses",
    definition: "A long focal length which isolates distant subjects, heavily compressing background elements so they appear much larger and closer to the foreground.",
    visualType: "lens-telephoto",
    promptSnippets: {
      image: "shot on 200mm telephoto lens, background compression effect, isolating distant subject, shallow plane of focus",
      video: "telephoto tracking shot, 200mm compression, city background appears flattened and gigantic directly behind the running protagonist"
    },
    promptTemplate: "isolated subject, background compressed with 200mm telephoto lens",
    tip: "Use this to place massive backgrounds (like a giant sun, moon, mountains, or skyscrapers) immediately behind your subject.",
    expertInsight: "Telephoto compression is a visual illusion. By standing very far from the subject, you reduce spatial perspective, making distance look flat."
  },
  {
    id: "lens-macro-100mm",
    name: "100mm Macro Lens",
    category: "lenses",
    definition: "A lens designed for extreme close-ups, capable of focusing on minute details with a 1:1 or greater reproduction ratio and razor-thin plane of focus.",
    visualType: "lens-macro",
    promptSnippets: {
      image: "macro lens photography, 100mm macro, extreme detail, razor-thin depth of field, microscopic texture, dust motes visible",
      video: "microscopic dolly-in, water droplet impact in extreme macro close-up, liquid dynamics under macro magnification"
    },
    promptTemplate: "macro detail shot, razor-sharp textures, 100mm macro",
    tip: "Use to unlock gorgeous, intricate details: eyes/irises, water droplets, circuit board soldier lines, insect wings, or crystal structures.",
    expertInsight: "Macro focus requires extreme light. In prompting, couple this with 'macro ring light' or 'highly detailed focal lighting' to get sharp textures."
  },

  // --- Angles ---
  {
    id: "angle-dutch",
    name: "Dutch Angle / Canted Frame",
    category: "angles",
    definition: "A shot where the camera is explicitly rotated on its roll axis, rendering horizontal lines diagonal to convey disorientation, tension, or madness.",
    visualType: "angle-dutch",
    promptSnippets: {
      image: "dutch angle shot, canted camera frame, diagonal horizon, off-center perspective, tense atmospheric frame",
      video: "canted angle tilt, high action pursuit filmed with dynamic dutch angle roll, creating psychological panic"
    },
    promptTemplate: "dutch angle frame, canted horizon, psychological tension",
    tip: "Use sparingly in dramatic night scenes, chases, or expressions of psychological discomfort. It instantly adds expressionistic energy.",
    expertInsight: "Popularized by German Expressionist cinema (hence 'German'/'Deutsch' angle). It visually screams that something is fundamentally wrong."
  },
  {
    id: "angle-low-hero",
    name: "Low Angle (Hero Shot)",
    category: "angles",
    definition: "The camera is placed below the subject's eye level looking upwards, making the subject appear powerful, authoritative, imposing, or heroic.",
    visualType: "angle-low",
    promptSnippets: {
      image: "low angle hero shot, looking up at the subject, imposing stature, powerful presence, low-to-ground camera angle",
      video: "dynamic low angle tracking, panning upwards pointing at the towering character, monumental aesthetic"
    },
    promptTemplate: "low angle camera, towering majestic hero framing",
    tip: "Great for action heroes, towering structures, impressive villains, or corporate masters. Combine with high-contrast backlight.",
    expertInsight: "Low angles align the viewer's point of view to that of a child or subordinate, physically forcing an attitude of respect/awe."
  },
  {
    id: "angle-high-bird",
    name: "High Angle / Bird's-Eye",
    category: "angles",
    definition: "The camera is positioned high up looking down on the subject, making them appear small, fragile, vulnerable, or providing a strategic overview.",
    visualType: "angle-high",
    promptSnippets: {
      image: "high angle bird's-eye view, looking down on the lonely subject, geometric scenery, perspective of isolation",
      video: "vertical overhead drone view, slowly rotating down-shot, capturing the intricate maze layout"
    },
    promptTemplate: "high angle downshot, bird's-eye composition",
    tip: "Use to emphasize a tiny character in a vast, overwhelming desert, a busy city crossing, or to portray intense psychological helplessness.",
    expertInsight: "Overhead shots (or God's-eye-view) detach us from individual human struggles, presenting them in a mathematical, landscape-like layout."
  },
  {
    id: "angle-over-the-shoulder",
    name: "Over-the-Shoulder (OTS)",
    category: "angles",
    definition: "A shot of one character from behind the shoulder of another character, creating depth and placing the viewer in the middle of a conversation.",
    visualType: "angle-ots",
    promptSnippets: {
      image: "over-the-shoulder shot, over-the-shoulder perspective looking at the main subject in discussion, foreground frame depth",
      video: "cinematic conversation, slow emotional dialog over-the-shoulder shot, shallow depth of field shifting with rack focus"
    },
    promptTemplate: "over-the-shoulder conversational view, cinematic dialogue depth",
    tip: "Perfect for character-driven scenes, romantic glances, or high-stakes interrogations. It establishes a powerful visual layer of depth.",
    expertInsight: "By framing the back of the foreground player, we ground the focal subject in physical three-dimensional space, preventing flat shots."
  },

  // --- Framing ---
  {
    id: "framing-extreme-closeup",
    name: "Extreme Close-Up (ECU)",
    category: "framing",
    definition: "A crop that targets only a small portion of the subject, such as just the eyes, lips, or a single detail, establishing intense emotional gravity.",
    visualType: "framing-ecu",
    promptSnippets: {
      image: "extreme close-up macro, dramatic tight crop on the eyes, reflective pupils, high texture skin, raw emotion",
      video: "slow extreme close-up dolly, focus pulling to the sweating furrowed brow and intense gaze of the master artist"
    },
    promptTemplate: "extreme close-up on [SUBJECT_DETAIL], dramatic skin texture",
    tip: "In prompts, describe what is reflected inside the eyes (e.g., 'eyes reflecting neon city lights') to add incredible cinematic realism.",
    expertInsight: "ECU cuts out all surrounding context, forcing the audience into a hyper-focused state of empathy or uncomfortable intimacy."
  },
  {
    id: "framing-medium-shot",
    name: "Medium Shot (MS)",
    category: "framing",
    definition: "Framing a individual from roughly the waist up. Balance of facial expression, hand gestures, and surrounding environment details.",
    visualType: "framing-ms",
    promptSnippets: {
      image: "medium shot, waist-up framing, natural stance, capturing clothing textures and conversational environment in background",
      video: "medium shot walking and talking dialogue, camera tracking backwards smoothly keeping a steady waist-up dynamic profile"
    },
    promptTemplate: "medium shot, waist-up composition, cinematic depth of field",
    tip: "The ultimate 'storyteller' framing. It lets AI models properly render both detailed eyes/clothes and the atmospheric background context.",
    expertInsight: "Medium shots imitate our comfortable social distance with fellow humans, making them feel natural, highly conversational, and safe."
  },
  {
    id: "framing-cowboy-american",
    name: "Cowboy Shot (American Framing)",
    category: "framing",
    definition: "Framing from the mid-thigh up, originally developed in Westerns to show both a hero's face and their hip-holstered gun.",
    visualType: "framing-cowboy",
    promptSnippets: {
      image: "cowboy shot, mid-thigh framing, confident cinematic pose, leather boots and gear in focus, dramatic low-key styling",
      video: "low-angle cowboy shot, slow side track, showing the character preparing to act, hands poised right above the hip"
    },
    promptTemplate: "cowboy shot composition, mid-thigh to head framing",
    tip: "Use to display character action, tactical outfits, stylish swords/belts, or confident stances while maintaining rich facial detail.",
    expertInsight: "Also called 'American Shot' (Moyen Rapproché) by French critics. It gives a sense of action readiness and physical capability."
  },
  {
    id: "framing-extreme-wide",
    name: "Extreme Wide Shot (EWS) / Establishing Shot",
    category: "framing",
    definition: "An epic, monumental scale view of a vast environment where human or subject elements appear tiny or microscopic, cementing the setting and atmosphere.",
    visualType: "framing-ews",
    promptSnippets: {
      image: "establishing shot, extreme wide shot, massive epic fantasy landscape, colossal mountain range towering over a tiny lone traveler",
      video: "epic slow zoom-out establishing shot, grand sci-fi metropolis, giant structures stretching into the morning clouds"
    },
    promptTemplate: "extreme wide shot, panoramic establishing shot, grand scale landscape",
    tip: "Perfect for establishing vast scale. Combine. with high-contrast light, mist, clouds, or massive architectural geometry.",
    expertInsight: "In narrative cinema, this is the 'where' shot. It introduces the emotional climate and environmental scale before zooming into human drama."
  },

  // --- Lighting ---
  {
    id: "lighting-rembrandt",
    name: "Rembrandt Lighting",
    category: "lighting",
    definition: "A portrait lighting setup characterized by a dramatic triangle of light on the shadowed cheek, creating a moody, chiaroscuro, classical portrait style.",
    visualType: "lighting-rembrandt",
    promptSnippets: {
      image: "moody Rembrandt lighting, cinematic chiaroscuro portrait, dark background, distinct light triangle on cheek, sharp catchlight in eyes",
      video: "high-contrast cinematic portrait video, lit with soft Rembrandt side-key light, casting evocative shadows across the contemplative face"
    },
    promptTemplate: "cinematic Rembrandt lighting style, intense chiaroscuro depth, highly moody shadows",
    tip: "This is the shortcut to 'masterpiece' class portrait aesthetics. It adds depth, texture, and immediate artistic gravity to any character pose.",
    expertInsight: "Named after the classical painter Rembrandt van Rijn, who frequently used this lighting angle in his dramatic self-portraits."
  },
  {
    id: "lighting-highkey",
    name: "High-Key Lighting Setup",
    category: "lighting",
    definition: "A bright, even, low-contrast lighting style using multiple fill lights to minimize deep shadows, creating an upbeat, clean, sterile, or angelic mood.",
    visualType: "lighting-highkey",
    promptSnippets: {
      image: "high-key lighting, modern bright commercial aesthetic, clean soft shadows, radiant white atmospheric background, perfect exposure",
      video: "crisp studio bright commercial video, soft diffused high-key lights wrapping around the clean product, luxurious and upbeat"
    },
    promptTemplate: "high-key light setup, diffused, extremely bright and clean studio shot",
    tip: "Ideal for sci-fi futuristic spaceships, luxury modern interior design, commercial fashion, or professional corporate profile headshots.",
    expertInsight: "Historically required in early TV and film because low-contrast images did not stream well over old low-bandwidth transmitters."
  },
  {
    id: "lighting-lowkey",
    name: "Chiaroscuro / Low-Key Lighting",
    category: "lighting",
    definition: "A high-contrast lighting technique dominated by deep blacks and single strong light sources, exaggerating textures, mystery, and theatrical drama.",
    visualType: "lighting-lowkey",
    promptSnippets: {
      image: "sculpted low-key lighting, dark moody chiaroscuro vibe, deep shadows swallow background, sharp highlights tracing contours",
      video: "noir style low-key sequence, a single harsh searchlight piercing smoky atmosphere, revealing stark silhouettes in heavy shadows"
    },
    promptTemplate: "dramatic chiaroscuro lighting, moody low-key composition with deep shadows",
    tip: "Perfect for thrillers, film noir, moody cafes, high-drama sports/workouts, or portraying dark, mysterious entities.",
    expertInsight: "In lighting-speak, it utilizes a very high lighting ratio (key-to-fill of 8:1 or more). The goal is to draw form purely out of darkness."
  },
  {
    id: "lighting-rim-edge",
    name: "Rim / Edge Backlighting",
    category: "lighting",
    definition: "Placing a strong light source directly behind the subject to create a glowing border or halo around their contour, silhouetting and separating them from dark backgrounds.",
    visualType: "lighting-rim",
    promptSnippets: {
      image: "harsh golden rim lighting, edge silhouette glow, bright luminous hair details, separation from pitch-black atmospheric back",
      video: "dramatic rim-lit backlit scene, light leaks flare into lens as the subject steps in front of the blinding volumetric backlight"
    },
    promptTemplate: "dramatic rim lighting, bright luminous silhouette border",
    tip: "Excellent for showing off physical muscular definition, action silhouettes, smoke particles, or gorgeous messy hair details.",
    expertInsight: "Often called 'hair light' in studio work. It is the secret weapon for making dark hair or dark garments pop off black backdrops."
  },
  {
    id: "lighting-three-point",
    name: "Three-Point Studio Lighting",
    category: "lighting",
    definition: "The fundamental professional lighting configuration consisting of a Key Light (dominant exposure), Fill Light (softens shadows), and Rim/Back Light (adds three-dimensional separation).",
    visualType: "lighting-threepoint",
    promptSnippets: {
      image: "studio 3-point lighting setup, cinematic key light, soft diffused fill light, crisp hair backlight, highly three-dimensional modeling",
      video: "high production interview, flawless three-point lighting modeling the face, elegant blurred office background"
    },
    promptTemplate: "professional 3-point lighting setup, high-end commercial studio modeling",
    tip: "Specify this when you want a flawless, clean, three-dimensional studio portrait or product shot with balanced but artistic dimension.",
    expertInsight: "The holy grail of professional interview and lighting design. It controls contrast (key vs. fill) and separation (rim) perfectly."
  },

  // --- Movements ---
  {
    id: "movement-dolly-zoom",
    name: "Vertigo / Dolly Zoom",
    category: "movements",
    definition: "An in-camera effect where the camera dollys forward while zooming out (or vice versa), dramatically shifting background scale while the core subject size remains unchanged.",
    visualType: "movepin-dollyzoom",
    promptSnippets: {
      image: "dolly zoom simulation, vertigo effect, deep distorted background tunnel compression, focal subject scale remains fixed",
      video: "vertigo effect dolly-zoom, camera pulls back rapidly while zooming in on the horrified character face, background warps inward dramatically"
    },
    promptTemplate: "cinematic dolly zoom (vertigo effect), background warping dramatically",
    tip: "An incredibly powerful video prompt command! Use when a character realizes a shocking twist, gets dizzy, or encounters instant dread.",
    expertInsight: "Invented by Irmin Roberts, a Paramount second-unit cameraman, and popularized by Alfred Hitchcock's legendary film 'Vertigo'."
  },
  {
    id: "movement-steadicam-tracking",
    name: "Steadicam Tracking Shot",
    category: "movements",
    definition: "A smooth, highly fluid tracking movement following a moving subject through dynamic landscapes, avoiding any handheld jitter or robotic stiffness.",
    visualType: "movepin-tracking",
    promptSnippets: {
      image: "tracking perspective, camera traveling behind the protagonist mid-stride, dynamic motion blur on landscape margins",
      video: "fluid steadicam tracking shot, following closely behind as character navigates active busy market, seamless kinetic camera sweep"
    },
    promptTemplate: "smooth steadicam tracking shot, dynamic panning behind the moving subject",
    tip: "Use for long, continuous immersion in video creation tools. It prompts the model to generate smooth forward or backward locomotion.",
    expertInsight: "The Steadicam revolutionized cinematography by mechanically decoupling camera motion from the operator's body using an articulating arm."
  },
  {
    id: "movement-crane-jib-reveal",
    name: "Crane / Jib Aerial Reveal",
    category: "movements",
    definition: "The camera is mounted on a robotic crane, sweeping upwards or downwards over a physical barrier to reveal a vast, breathtaking scenario.",
    visualType: "movepin-crane",
    promptSnippets: {
      image: "high-elevation crane shot, dramatic overlook revealing boundless horizons beyond the structural brick wall",
      video: "cinematic crane sweep shot, starting low on ground details then climbing high to reveal majestic ancient ruins in morning fog"
    },
    promptTemplate: "sweeping crane shot climb, grand architectural landscape reveal",
    tip: "Ideal for introductory scene openings in video creators. Command it to start on a small focal object, then climb to reveal the grand environment.",
    expertInsight: "Crane shots provide a sudden, majestic transition from human-scale action to omniscient global landscapes, lifting the emotional stakes."
  },

  // --- Color & Film Stocks ---
  {
    id: "color-kodachrome-vintage",
    name: "Kodachrome 64 Film Stock",
    category: "color-film",
    definition: "A legendary color-reversal analog film stock known for its rich, saturated warm yellows and reds, high contrast, fine grain, and iconic retro realism.",
    visualType: "color-kodachrome",
    promptSnippets: {
      image: "shot on Kodachrome 64, vintage 1970s analog photography, warm organic skin tones, rich saturated primary colors, fine nostalgic grain",
      video: "archival retro footage, Kodachrome film stock saturation, warm yellows and retro red tints, authentic nostalgic family scene"
    },
    promptTemplate: "vintage analog picture style, shot on Kodachrome 64, rich color tones",
    tip: "Use to invoke rich, hyper-realistic nostalgic vibes. Think vintage Americana, mid-century roadtrips, desert diners, or retro street art.",
    expertInsight: "Kodachrome required a complex dye-adding development process. Discontinued in 2009, it remains the pinnacle of retro documentary realism."
  },
  {
    id: "color-cinestill-800t",
    name: "Cinestill 800T (Halation Vibe)",
    category: "color-film",
    definition: "A tungsten-balanced color film stock famous for creating a vibrant, glowing red 'halation' ring around bright lights, paired with deep blue and green shadows.",
    visualType: "color-cinestill",
    promptSnippets: {
      image: "shot on CineStill 800T, night neon cinematic, iconic glowing red halations around street lamps, moody cyan/tungsten color palette, gritty look",
      video: "gritty cinematic night sequence, CineStill 800T film look, distinct red glowing light halations, moody industrial green and cyan tones"
    },
    promptTemplate: "night photography shot on CineStill 800T, cinematic neon halations",
    tip: "The absolute best choice for cyberpunk, wet night streets, rain-slicked city alleys, moody jazz bars, or industrial neon scenes.",
    expertInsight: "Cinestill is created by chemically removing the anti-halation soot layer (rem-jet) from Kodak motion picture films, causing light to leak backward."
  },
  {
    id: "color-teal-orange",
    name: "Teal & Orange Hollywood Grade",
    category: "color-film",
    definition: "The iconic Hollywood block-buster color grading style that pushes sky and shadows into cyan/teal while highlighting human skin in warm orange/amber.",
    visualType: "color-tealorange",
    promptSnippets: {
      image: "Teal and Orange cinematic color grading, high block-buster contrast, rich skin tones, deep cyan shadow grading, dynamic blockbuster sheen",
      video: "action drama aesthetic, high-gloss Teal and Orange Hollywood color grade, deep blue-grey shadows, warm glowing faces"
    },
    promptTemplate: "Teal and Orange Hollywood color grading, epic blockbuster look",
    tip: "Use this to give your prompts an instant, high-budget Hollywood action look. It makes colors highly complementary and visually satisfying.",
    expertInsight: "Teal and orange are polar opposites on the color wheel. This extreme contrast maximizes visual separation between actors and settings."
  },
  {
    id: "color-film-noir-blackwhite",
    name: "Film Noir / Chiaroscuro B&W",
    category: "color-film",
    definition: "Highly stylized high-contrast monochrome cinematography, utilizing venetian blind shadows, dark wet streets, silhouettes, and smoke-filled rooms.",
    visualType: "color-noir",
    promptSnippets: {
      image: "stark Film Noir photography, high-contrast monochrome, dramatic shadow casting from window blinds, gritty rain streets, dramatic silhouette style",
      video: "gritty noir 1940s tracking sequence, rich black-and-white, a mysterious silhouetted man in trenchcoat under flickering street light"
    },
    promptTemplate: "Film Noir black and white photography style, dramatic diagonal shadows",
    tip: "Combine with keywords like 'venetian blind shadow lines across subject' or 'smoke curling under spotlights' for authentic noir atmosphere.",
    expertInsight: "Noir means 'black' in French. It borrowed heavily from German Expressionist cinematography, reflecting postwar disillusionment and moral grey zones."
  }
];

export const MOCK_CHALLENGES: QuizChallenge[] = [
  {
    id: "chal-1",
    title: "Dramatic Boxing Silhouette",
    description: "Formulate an image prompt describing a boxer sitting on a stool in a moody locker room. The boxer should be silhouetted by light framing his muscular outline. The atmosphere must feel sweaty, dusty, and full of heavy dramatic shadow.",
    category: "Lighting Setup",
    requiredElements: ["rim lighting", "low-key", "85mm portrait"],
    sampleSolution: "A low-key portrait of a muscular boxer on a wooden stool in a dusty locker room. Dramatic rim lighting outlines his back and arms. Volumetric dust motes in key-focus. Shallow depth of field, shot on 85mm portrait prime lens, f/1.4 aperture, chiaroscuro shadow styling, IMAX film grain. --ar 16:9"
  },
  {
    id: "chal-2",
    title: "Vibrant Retro Cyberpunk Night",
    description: "Draft a cinematic prompt of a rainy Tokyo alleyway at night, populated by neon glowing ramen signs. We want the street lights to have that iconic warm, nostalgic red glow (halation) around them, paired with cool teal-blue shadows.",
    category: "Optics & Color Grade",
    requiredElements: ["CineStill 800T", "anamorphic", "halation"],
    sampleSolution: "A cinematic night scene in a rain-slicked Tokyo alleyway with glowing neon banners. Shot on an anamorphic lens with cinematic aspect ratio, and on CineStill 800T film. Distinct red glowing halations around neon light bulbs, moody cyan and deep green shadows, reflections in puddles, horizontal light leaks. --ar 21:9"
  },
  {
    id: "chal-3",
    title: "Sweeping Epic Mountain Discovery",
    description: "Write an introductory AI video prompt for a majestic sequence. The shot begins closely focused on a tiny mountain flower, then climbs smoothly upwards to reveal a traveler discovering a colossal ancient cathedral carved directly into a snowy peak.",
    category: "Camera Movements",
    requiredElements: ["crane movement", "establishing wide shot", "14mm wide-angle"],
    sampleSolution: "Cinematic drone or crane reveal shot. Starts in macro close-up of a small frozen flower on a ridge, then slowly blocks upwards in a sweeping crane reveal to a majestic extreme wide establishing shot of a colossal Gothic cathedral carved into a snowy mountain face. A tiny traveler looks up in awe. 14mm ultra-wide-angle lens, volumetric mist. Smooth camera action."
  }
];
