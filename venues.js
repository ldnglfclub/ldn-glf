/* ============================================================
   LDN GLF CLUB — Unified venue dataset
   Single source of truth for: Atlas, Scorecard, Caddie intel.
   ============================================================
   Schema per venue:
     id: unique slug
     name: display name
     region: 'london' | 'south_east' | 'south_west' | 'midlands' |
             'north_west' | 'north_east' | 'wales' | 'scotland' | 'ni'
     town: nearest recognisable town
     type: 'course' | 'range' | 'topgolf' | 'crazy' | 'adventure' |
           'pitchputt' | 'indoor'
     format: short string ("18-hole parkland", "27 holes", "Mini golf 18-hole" etc)
     priceBand: '£' | '££' | '£££' | '££££' (rough adult round / session)
     youthPolicy: short string — what we know about under-18 access
     website: official URL
     atlasNote: one-liner of why it's worth knowing
     hasFullCaddie: true if hole-by-hole intel exists in caddie.html
     caddieKey?: matching key in caddie.html stages (princes, dukes, shire)
   ============================================================ */

window.LDN_VENUES = [

  /* ============================================================
     LONDON — 20 curated venues (the original Atlas)
     ============================================================ */
  {
    id: 'topgolf-watford',
    name: 'Topgolf Watford',
    region: 'london',
    town: 'Watford',
    type: 'topgolf',
    format: 'Topgolf bays · 3 floors',
    priceBand: '££',
    youthPolicy: 'All ages welcome, junior pricing',
    website: 'https://topgolf.com/uk/watford/',
    atlasNote: "The original Topgolf — where it all began in 2000. Three floors of bays, music, food, no skill required."
  },
  {
    id: 'richmond-park-princes',
    name: "Richmond Park GC — Prince's Course",
    region: 'london',
    town: 'East Sheen',
    type: 'course',
    format: '18-hole · Par 68 · 5,487 yds',
    priceBand: '££',
    youthPolicy: 'Junior memberships available, public access',
    website: 'https://www.richmondparkgolfclub.org.uk/',
    atlasNote: "Fred Hawtree 1923, redesigned 2013. The shorter, more forgiving of Richmond Park's two courses — perfect for juniors.",
    hasFullCaddie: true,
    caddieKey: 'princes'
  },
  {
    id: 'richmond-park-dukes',
    name: "Richmond Park GC — Duke's Course",
    region: 'london',
    town: 'East Sheen',
    type: 'course',
    format: '18-hole · Par 71 · 6,359 yds',
    priceBand: '££',
    youthPolicy: 'Junior memberships available, public access',
    website: 'https://www.richmondparkgolfclub.org.uk/',
    atlasNote: "The grown-up sibling. Beverley Brook winds through holes 3-6 and 12-14. A proper test.",
    hasFullCaddie: true,
    caddieKey: 'dukes'
  },
  {
    id: 'greenwich-peninsula',
    name: 'Greenwich Peninsula Driving Range',
    region: 'london',
    town: 'Greenwich (SE10)',
    type: 'range',
    format: '60-bay floodlit range',
    priceBand: '£',
    youthPolicy: 'All ages welcome',
    website: 'https://www.greenwichpeninsuladrivingrange.co.uk/',
    atlasNote: "Riverside range with views to the O2. Toptracer on every bay, late open, easy tube/DLR."
  },
  {
    id: 'swingers-west-end',
    name: 'Swingers Crazy Golf — West End',
    region: 'london',
    town: 'Oxford Circus (W1)',
    type: 'crazy',
    format: 'Mini golf · 2 × 9-hole courses',
    priceBand: '££',
    youthPolicy: '18+ at most times, Sunday family sessions until 5pm',
    website: 'https://swingersldn.com/',
    atlasNote: "British seaside theme, cocktails, street food. Family sessions Sunday afternoons only — check before you bring under-18s."
  },
  {
    id: 'puttshack-watford',
    name: 'Puttshack — Watford',
    region: 'london',
    town: 'Watford',
    type: 'crazy',
    format: 'Mini golf · 4 × 9-hole courses',
    priceBand: '££',
    youthPolicy: 'All ages welcome',
    website: 'https://www.puttshack.com/uk/locations/watford/',
    atlasNote: "Tech-tracked mini golf — no scoring needed. Trivia holes, beer pong holes, the lot. Kids included anytime."
  },
  {
    id: 'world-of-golf-new-malden',
    name: 'World of Golf — New Malden',
    region: 'london',
    town: 'New Malden',
    type: 'range',
    format: '60-bay range + 9-hole par-3 + AdventureLand mini',
    priceBand: '£',
    youthPolicy: 'All ages welcome',
    website: 'https://www.worldofgolf.co.uk/london/',
    atlasNote: "Range + short course + mini golf in one site. South west London's all-in-one beginner-to-improver venue."
  },
  {
    id: 'metro-golf-centre',
    name: 'Metro Golf Centre',
    region: 'london',
    town: 'Hendon (NW4)',
    type: 'range',
    format: '24-bay range + 9-hole par-3 course',
    priceBand: '£',
    youthPolicy: 'Junior lessons, all ages',
    website: 'https://www.metrogolfcentre.co.uk/',
    atlasNote: "PGA pros on tap, junior coaching strong here. North London's solid all-rounder for getting better."
  },
  {
    id: 'dukes-meadows-golf',
    name: 'Dukes Meadows Golf',
    region: 'london',
    town: 'Chiswick (W4)',
    type: 'range',
    format: '60-bay range + 9-hole short course',
    priceBand: '£',
    youthPolicy: 'Junior academy, family sessions',
    website: 'https://www.dukesmeadowsgolf.com/',
    atlasNote: "Riverside Thames-side range. Strong junior programme. The 9-hole short course is a great first round."
  },
  {
    id: 'playgolf-london',
    name: 'Playgolf London',
    region: 'london',
    town: 'Northwick Park',
    type: 'range',
    format: '60-bay range + 9-hole par-3 course',
    priceBand: '£',
    youthPolicy: 'All ages welcome',
    website: 'https://www.playgolflondon.co.uk/',
    atlasNote: "Brent's main range. Toptracer bays, big practice green, lesson packages for kids."
  },
  {
    id: 'bigshots-northwick-park',
    name: 'BigShots Golf — Northwick Park',
    region: 'london',
    town: 'Northwick Park',
    type: 'topgolf',
    format: 'Topgolf-style entertainment bays',
    priceBand: '££',
    youthPolicy: 'All ages welcome',
    website: 'https://bigshotsgolf.co.uk/',
    atlasNote: "Topgolf-style venue with food and music. North-west London's answer to Watford."
  },
  {
    id: 'shire-london',
    name: 'The Shire London — Ballesteros Masters',
    region: 'london',
    town: 'Barnet',
    type: 'course',
    format: '18-hole · Par 72 · 7,028 yds',
    priceBand: '£££',
    youthPolicy: 'Junior memberships, no clubhouse dress code',
    website: 'https://theshirelondon.com/',
    atlasNote: "Seve Ballesteros' only UK course design. Six par-3s, six par-4s, six par-5s. S-shaped lake on 18.",
    hasFullCaddie: true,
    caddieKey: 'shire'
  },
  {
    id: 'beckenham-place-golf',
    name: 'Beckenham Place Golf',
    region: 'london',
    town: 'Beckenham',
    type: 'course',
    format: '18-hole parkland + 9-hole short course',
    priceBand: '£',
    youthPolicy: 'Junior-friendly, public access via Mytime Active',
    website: 'https://www.mytimeactive.co.uk/golf/beckenham',
    atlasNote: "South-east London's parkland 18-holer. The 9-hole short course is one of the best junior intro circuits in the city."
  },
  {
    id: 'pitch-city-indoor',
    name: 'Pitch City Indoor Golf',
    region: 'london',
    town: 'Shoreditch',
    type: 'indoor',
    format: 'Indoor simulator bays',
    priceBand: '££',
    youthPolicy: 'All ages welcome with adult booking',
    website: 'https://pitchcity.co.uk/',
    atlasNote: "Indoor sim bays in Shoreditch. Rain plan. Play St Andrews, Pebble Beach, Augusta — all in EC2."
  },
  {
    id: 'urban-golf-soho',
    name: 'Urban Golf — Soho',
    region: 'london',
    town: 'Soho (W1)',
    type: 'indoor',
    format: 'Indoor simulator bays',
    priceBand: '££',
    youthPolicy: 'All ages welcome with adult booking',
    website: 'https://www.urbangolf.co.uk/',
    atlasNote: "Central London's original indoor sim spot. Soho. Books up fast in winter."
  },
  {
    id: 'brent-valley-golf',
    name: 'Brent Valley Golf Course',
    region: 'london',
    town: 'Ealing (W7)',
    type: 'course',
    format: '9-hole parkland (currently 9, was 18)',
    priceBand: '£',
    youthPolicy: 'Public, very affordable, junior-friendly',
    website: 'https://www.brentvalleygolf.co.uk/',
    atlasNote: "West London public golf. Budget-friendly first-round territory."
  },
  {
    id: 'plonk-borough',
    name: 'Plonk Crazy Golf — Borough',
    region: 'london',
    town: 'Borough (SE1)',
    type: 'crazy',
    format: 'Mini golf · 9-hole',
    priceBand: '££',
    youthPolicy: 'Under-18s welcome during day, 18+ from 7pm',
    website: 'https://www.plonkgolf.co.uk/',
    atlasNote: "Plonk has venues in Shoreditch, Hackney and Borough. Kids welcome before 7pm. Borough is the newest."
  },
  {
    id: 'putt-in-the-park-battersea',
    name: 'Putt in the Park — Battersea',
    region: 'london',
    town: 'Battersea (SW11)',
    type: 'crazy',
    format: 'Outdoor mini golf · 18-hole',
    priceBand: '£',
    youthPolicy: 'All ages welcome, family-first',
    website: 'https://puttinthepark.com/',
    atlasNote: "Outdoor mini golf in Battersea Park. Also in Acton, Gunnersbury and Wandsworth. Kids' golf done properly."
  },
  {
    id: 'lee-valley-golf',
    name: 'Lee Valley Golf Course',
    region: 'london',
    town: 'Edmonton (N9)',
    type: 'course',
    format: '18-hole + driving range + footgolf',
    priceBand: '£',
    youthPolicy: 'Junior memberships, public access',
    website: 'https://www.leevalleygolf.org.uk/',
    atlasNote: "North-east London public golf. Course, range and FootGolf all on one site — and reasonably priced."
  },
  {
    id: 'trent-park-golf',
    name: 'Trent Park Golf Club',
    region: 'london',
    town: 'Enfield',
    type: 'course',
    format: '18-hole + 9-hole + range',
    priceBand: '£',
    youthPolicy: 'Junior memberships, pay-and-play',
    website: 'https://www.trentparkgolfclub.com/',
    atlasNote: "North London's big public site — 18, 9 and a range on a beautiful old estate. Easy to spend a whole day."
  },
  {
    id: 'pitch-and-putt-various',
    name: 'Pitch & Putt — Various Boroughs',
    region: 'london',
    town: 'Various',
    type: 'pitchputt',
    format: 'Council-run short courses',
    priceBand: '£',
    youthPolicy: 'Almost always under-£10 youth rate',
    website: 'https://www.london.gov.uk/',
    atlasNote: "Most London boroughs run a pitch-and-putt somewhere. Hackney's Clissold, Lambeth's Brockwell — your first round shouldn't cost £50."
  },

  /* ============================================================
     SOUTH WEST — Devon, Cornwall, Bristol, Bath, Somerset
     ============================================================ */
  {
    id: 'st-mellion',
    name: 'St Mellion Estate',
    region: 'south_west',
    town: 'Saltash, Cornwall',
    type: 'course',
    format: '2 × 18-hole + range',
    priceBand: '£££',
    youthPolicy: 'Junior memberships, resort access',
    website: 'https://www.st-mellion.co.uk/',
    atlasNote: "Cornwall's Nicklaus course — host venue when the European Tour came south. Resort hotel, range, the lot."
  },
  {
    id: 'trevose-golf',
    name: 'Trevose Golf & Country Club',
    region: 'south_west',
    town: 'Padstow, Cornwall',
    type: 'course',
    format: '18-hole links + 2 short courses',
    priceBand: '£££',
    youthPolicy: 'Family club, junior pricing strong',
    website: 'https://www.trevose-gc.co.uk/',
    atlasNote: "Harry Colt links from 1925. Beachside, family-run, holiday-golf heaven on the north Cornish coast."
  },
  {
    id: 'st-enodoc',
    name: 'St Enodoc Golf Club',
    region: 'south_west',
    town: 'Rock, Cornwall',
    type: 'course',
    format: 'Church Course (18) + Holywell (18)',
    priceBand: '£££',
    youthPolicy: 'Visitors welcome, junior rates',
    website: 'https://www.st-enodoc.co.uk/',
    atlasNote: "Camel estuary links with a buried church on the 10th. Top 100 in GB&I. The Holywell course is a shorter, friendly second."
  },
  {
    id: 'royal-north-devon',
    name: 'Royal North Devon (Westward Ho!)',
    region: 'south_west',
    town: 'Westward Ho!, Devon',
    type: 'course',
    format: '18-hole links · Par 72',
    priceBand: '£££',
    youthPolicy: 'England\'s oldest links — junior rates available',
    website: 'https://www.royalnorthdevongolfclub.co.uk/',
    atlasNote: "Founded 1864 — the oldest links in England. Sheep on the fairways, history in every bunker."
  },
  {
    id: 'saunton-golf',
    name: 'Saunton Golf Club',
    region: 'south_west',
    town: 'Braunton, Devon',
    type: 'course',
    format: 'East (18) + West (18) links',
    priceBand: '£££',
    youthPolicy: 'Junior memberships',
    website: 'https://www.sauntongolf.co.uk/',
    atlasNote: "Two championship links courses on the Braunton dunes. East is the headline; West is the underrated one."
  },
  {
    id: 'bovey-castle',
    name: 'Bovey Castle Golf Club',
    region: 'south_west',
    town: 'Dartmoor, Devon',
    type: 'course',
    format: '18-hole parkland',
    priceBand: '£££',
    youthPolicy: 'Family resort, junior access',
    website: 'https://www.boveycastle.com/golf',
    atlasNote: "Dartmoor National Park parkland with a country house hotel attached. Family golf weekend, sorted."
  },
  {
    id: 'shaldon-pitch-putt',
    name: 'Shaldon Pitch & Putt',
    region: 'south_west',
    town: 'Teignmouth, Devon',
    type: 'pitchputt',
    format: '18-hole pitch & putt',
    priceBand: '£',
    youthPolicy: 'No booking, no fuss, all ages',
    website: 'https://www.coastview.co.uk/',
    atlasNote: "One of the best pitch & putts in the South West. Views over the Teign Estuary. £8-ish."
  },
  {
    id: 'burnham-berrow',
    name: 'Burnham & Berrow Golf Club',
    region: 'south_west',
    town: 'Burnham-on-Sea, Somerset',
    type: 'course',
    format: '18-hole championship links',
    priceBand: '£££',
    youthPolicy: 'Junior memberships',
    website: 'https://www.burnhamandberrowgolfclub.co.uk/',
    atlasNote: "Top 100 GB&I links. Open qualifier venue. Towering dunes, fast greens, proper test."
  },
  {
    id: 'weston-super-mare',
    name: 'Weston-Super-Mare Golf Club',
    region: 'south_west',
    town: 'Weston-super-Mare, Somerset',
    type: 'course',
    format: '18-hole links',
    priceBand: '££',
    youthPolicy: 'Visitors welcome, junior rates',
    website: 'https://www.wsmgolfclub.co.uk/',
    atlasNote: "Alister MacKenzie-touched links — far cheaper than Burnham & Berrow next door, almost as good."
  },
  {
    id: 'ashton-court-bristol',
    name: 'Ashton Court Estate Golf',
    region: 'south_west',
    town: 'Bristol',
    type: 'pitchputt',
    format: '2 × 18-hole par-3 + FootGolf + DiscGolf',
    priceBand: '£',
    youthPolicy: 'All ages, parking free for golfers',
    website: 'https://bristol.gov.uk/web/parks/ashton-court-estate',
    atlasNote: "Bristol's pay-and-play par-3 estate. Cheap, accessible, kids welcome. FootGolf too."
  },
  {
    id: 'bath-golf-club',
    name: 'Bath Golf Club',
    region: 'south_west',
    town: 'Bath',
    type: 'course',
    format: '18-hole · Par 71',
    priceBand: '££',
    youthPolicy: 'Junior section, visitors welcome',
    website: 'https://www.bathgolfclub.org.uk/',
    atlasNote: "On high ground above Bath. Free-draining, year-round playable. Views over the city."
  },
  {
    id: 'mendip-spring',
    name: 'Mendip Spring Golf Club',
    region: 'south_west',
    town: 'Congresbury, Somerset',
    type: 'course',
    format: '18-hole + 9-hole',
    priceBand: '££',
    youthPolicy: 'Visitors and juniors welcome',
    website: 'https://www.mendipspringgolfclub.co.uk/',
    atlasNote: "Brinsea Championship course + Lakeside 9-hole. South of Bristol — well-run, friendly, varied."
  },
  {
    id: 'pirate-bay-bristol',
    name: 'Pirate Bay Adventure Golf',
    region: 'south_west',
    town: 'Bristol',
    type: 'crazy',
    format: 'Mini golf · 18-hole',
    priceBand: '£',
    youthPolicy: 'Family-first, all ages',
    website: 'https://www.piratebay-adventuregolf.co.uk/',
    atlasNote: "Pirate-themed crazy golf in Bristol. Swords up. Crocs lurking. Kids' birthday-party heaven."
  },

  /* ============================================================
     SOUTH EAST — Brighton, Sussex, Kent, Surrey
     ============================================================ */
  {
    id: 'topgolf-surrey',
    name: 'Topgolf — Surrey (Addlestone)',
    region: 'south_east',
    town: 'Addlestone, Surrey',
    type: 'topgolf',
    format: 'Topgolf bays · 3 floors',
    priceBand: '££',
    youthPolicy: 'All ages welcome, junior pricing',
    website: 'https://topgolf.com/uk/surrey/',
    atlasNote: "Topgolf's biggest UK site. Three floors, M25 access, junior-friendly all day."
  },
  {
    id: 'hollingbury-park',
    name: 'Hollingbury Park Golf Course',
    region: 'south_east',
    town: 'Brighton',
    type: 'course',
    format: '18-hole municipal · Par 72',
    priceBand: '£',
    youthPolicy: 'Public, junior rates, no membership required',
    website: 'https://www.hollingburygolf.com/',
    atlasNote: "Council-run Brighton course on the South Downs. Past Open qualifier site, panoramic 10th green. Annual membership famously cheap."
  },
  {
    id: 'dyke-golf-brighton',
    name: 'The Dyke Golf Club',
    region: 'south_east',
    town: 'Devil\'s Dyke, Brighton',
    type: 'course',
    format: '18-hole downland · Par 72',
    priceBand: '££',
    youthPolicy: 'Junior memberships',
    website: 'https://www.dykegolf.com/',
    atlasNote: "Downland course high above Brighton — 200m up, plays links-firm. National Trust borders. Wildlife everywhere."
  },
  {
    id: 'east-brighton-golf',
    name: 'East Brighton Golf Club',
    region: 'south_east',
    town: 'Brighton',
    type: 'course',
    format: '18-hole · Par 72 · 6,346 yds',
    priceBand: '££',
    youthPolicy: 'Junior section, visitors welcome',
    website: 'https://eastbrightongolfclub.co.uk/',
    atlasNote: "All-year-round playable, no temporary greens. Friendly, fair test on the eastern Downs."
  },
  {
    id: 'rye-golf-club',
    name: 'Rye Golf Club',
    region: 'south_east',
    town: 'Rye, East Sussex',
    type: 'course',
    format: '18-hole links · Par 68',
    priceBand: '£££',
    youthPolicy: 'Visitors limited — book ahead',
    website: 'https://www.ryegolfclub.co.uk/',
    atlasNote: "Henry Colt links 1904. One of the most underrated links in England. Wind, gorse, history."
  },
  {
    id: 'royal-ashdown-forest',
    name: 'Royal Ashdown Forest Golf Club',
    region: 'south_east',
    town: 'Forest Row, East Sussex',
    type: 'course',
    format: '18-hole heathland · No bunkers',
    priceBand: '£££',
    youthPolicy: 'Junior memberships',
    website: 'https://www.royalashdown.co.uk/',
    atlasNote: "Famous as the heathland course with NO bunkers — and still one of the best in the South East. Genuine quirk."
  },
  {
    id: 'royal-st-georges',
    name: "Royal St George's Golf Club",
    region: 'south_east',
    town: 'Sandwich, Kent',
    type: 'course',
    format: '18-hole championship links',
    priceBand: '££££',
    youthPolicy: 'Visitor access limited, junior rates available',
    website: 'https://www.royalstgeorges.com/',
    atlasNote: "Open Championship venue. England's premier links. Bucket-list golf if you can get a tee time."
  },
  {
    id: 'princes-sandwich',
    name: "Prince's Golf Club",
    region: 'south_east',
    town: 'Sandwich, Kent',
    type: 'course',
    format: '27-hole links (3 × 9)',
    priceBand: '£££',
    youthPolicy: 'Visitors very welcome, junior rates',
    website: 'https://www.princesgolfclub.co.uk/',
    atlasNote: "Three 9-hole loops next door to Royal St George's. Less famous, more accessible, brilliant links golf."
  },
  {
    id: 'wentworth-club',
    name: 'Wentworth Club — Edinburgh / West / East',
    region: 'south_east',
    town: 'Virginia Water, Surrey',
    type: 'course',
    format: '3 × 18-hole · West hosts BMW PGA',
    priceBand: '££££',
    youthPolicy: 'Members only mostly — Junior Academy access',
    website: 'https://www.wentworthclub.com/',
    atlasNote: "BMW PGA Championship venue. The West is one of the most televised courses in the country."
  },
  {
    id: 'walton-heath',
    name: 'Walton Heath Golf Club',
    region: 'south_east',
    town: 'Surrey',
    type: 'course',
    format: '2 × 18-hole heathland',
    priceBand: '££££',
    youthPolicy: 'Limited visitor access, junior rates',
    website: 'https://www.waltonheath.com/',
    atlasNote: "Surrey heathland royalty. Past Ryder Cup, regular US Senior Open venue."
  },

  /* ============================================================
     MIDLANDS — Birmingham, Nottingham, Leicester
     ============================================================ */
  {
    id: 'belfry-brabazon',
    name: 'The Belfry — Brabazon Course',
    region: 'midlands',
    town: 'Sutton Coldfield, West Midlands',
    type: 'course',
    format: '18-hole · Ryder Cup venue',
    priceBand: '££££',
    youthPolicy: 'Junior Academy, family rates available',
    website: 'https://www.thebelfry.com/golf/',
    atlasNote: "Four-time Ryder Cup host. The Brabazon's drivable 10th is the most famous risk-reward hole in England."
  },
  {
    id: 'belfry-pga',
    name: 'The Belfry — PGA National',
    region: 'midlands',
    town: 'Sutton Coldfield, West Midlands',
    type: 'course',
    format: '18-hole · PGA championship',
    priceBand: '£££',
    youthPolicy: 'Same as Brabazon, more accessible',
    website: 'https://www.thebelfry.com/golf/',
    atlasNote: "Brabazon's quieter sibling. Same standards, easier tee time, lower fee."
  },
  {
    id: 'forest-of-arden-arden',
    name: 'Forest of Arden — Arden Course',
    region: 'midlands',
    town: 'Meriden, West Midlands',
    type: 'course',
    format: '18-hole parkland · British Masters venue',
    priceBand: '£££',
    youthPolicy: 'Junior rates, family-friendly resort',
    website: 'https://www.marriottforestofarden.co.uk/',
    atlasNote: "Donald Steel parkland. Past British Masters and English Open host. Watch for the Black Deer."
  },
  {
    id: 'forest-of-arden-aylesford',
    name: 'Forest of Arden — Aylesford Course',
    region: 'midlands',
    town: 'Meriden, West Midlands',
    type: 'course',
    format: '18-hole · Par 69 · shorter',
    priceBand: '££',
    youthPolicy: 'Junior-friendly, great warm-up course',
    website: 'https://www.marriottforestofarden.co.uk/',
    atlasNote: "The Aylesford is the friendlier brother. Same standards, shorter, less brutal — great juniors round."
  },
  {
    id: 'woodhall-spa-hotchkin',
    name: 'Woodhall Spa — Hotchkin Course',
    region: 'midlands',
    town: 'Lincolnshire',
    type: 'course',
    format: '18-hole heathland · England Golf HQ',
    priceBand: '££££',
    youthPolicy: 'England Golf academy on site — strong junior programmes',
    website: 'https://www.englandgolf.org/woodhall-spa',
    atlasNote: "England Golf's home. Top-ranked inland course. Heather, gorse, bunkers — the lot."
  },
  {
    id: 'notts-hollinwell',
    name: 'Notts Golf Club (Hollinwell)',
    region: 'midlands',
    town: 'Kirkby-in-Ashfield, Notts',
    type: 'course',
    format: '18-hole heathland · Top 100',
    priceBand: '£££',
    youthPolicy: 'Junior memberships',
    website: 'https://www.nottsgolfclub.co.uk/',
    atlasNote: "Top 100 UK heathland. Hidden gem of the Midlands. Pure golfing terrain."
  },
  {
    id: 'sherwood-forest-golf',
    name: 'Sherwood Forest Golf Club',
    region: 'midlands',
    town: 'Mansfield, Nottinghamshire',
    type: 'course',
    format: '18-hole heathland',
    priceBand: '££',
    youthPolicy: 'Junior memberships',
    website: 'https://www.sherwoodforestgolfclub.co.uk/',
    atlasNote: "Heathland and silver birch — the Robin Hood country golfing experience."
  },
  {
    id: 'edgbaston-golf',
    name: 'Edgbaston Golf Club',
    region: 'midlands',
    town: 'Birmingham',
    type: 'course',
    format: '18-hole parkland · Harry Colt design',
    priceBand: '££',
    youthPolicy: 'Junior memberships',
    website: 'https://www.edgbastongc.co.uk/',
    atlasNote: "Birmingham city centre golf — Harry Colt parkland, minutes from the cricket ground."
  },
  {
    id: 'sutton-coldfield-golf',
    name: 'Sutton Coldfield Golf Club',
    region: 'midlands',
    town: 'Sutton Coldfield',
    type: 'course',
    format: '18-hole heathland',
    priceBand: '££',
    youthPolicy: 'Junior memberships',
    website: 'https://www.suttoncoldfieldgolfclub.co.uk/',
    atlasNote: "Alister MacKenzie heathland near the Belfry. Three consecutive par-3s in the front nine — rare quirk."
  },
  {
    id: 'paradise-island-derby',
    name: 'Paradise Island Adventure Golf — Derby',
    region: 'midlands',
    town: 'Derby',
    type: 'crazy',
    format: 'Indoor mini golf · 2 × 18',
    priceBand: '£',
    youthPolicy: 'Family-first, all ages',
    website: 'https://www.adventuregolf.com/derby/',
    atlasNote: "Tropical-themed indoor mini golf. Also sites in Cheshire Oaks, Sheffield, Rushden Lakes."
  },

  /* ============================================================
     NORTH WEST — Manchester, Liverpool, Lake District
     ============================================================ */
  {
    id: 'royal-birkdale',
    name: 'Royal Birkdale Golf Club',
    region: 'north_west',
    town: 'Southport, Merseyside',
    type: 'course',
    format: '18-hole championship links · Open venue',
    priceBand: '££££',
    youthPolicy: 'Limited visitor access, junior rates',
    website: 'https://www.royalbirkdale.com/',
    atlasNote: "2026 Open Championship venue. Top 10 in the world. The dunes do most of the design work."
  },
  {
    id: 'royal-liverpool-hoylake',
    name: 'Royal Liverpool (Hoylake)',
    region: 'north_west',
    town: 'Hoylake, Wirral',
    type: 'course',
    format: '18-hole championship links · Open venue',
    priceBand: '££££',
    youthPolicy: 'Limited visitor access, junior rates',
    website: 'https://www.royalliverpool.com/',
    atlasNote: "Open Championship venue (2014, 2023). Second-oldest links in England. Plays out-and-back classic."
  },
  {
    id: 'formby-golf',
    name: 'Formby Golf Club',
    region: 'north_west',
    town: 'Formby, Merseyside',
    type: 'course',
    format: '18-hole pine-fringed links',
    priceBand: '£££',
    youthPolicy: 'Junior memberships',
    website: 'https://www.formbygolfclub.co.uk/',
    atlasNote: "Links framed by pine trees — like nowhere else. The prettiest of the Lancashire coast eight."
  },
  {
    id: 'royal-lytham',
    name: "Royal Lytham & St Annes",
    region: 'north_west',
    town: 'Lytham St Annes, Lancs',
    type: 'course',
    format: '18-hole championship links',
    priceBand: '££££',
    youthPolicy: 'Limited visitor access',
    website: 'https://www.royallytham.org/',
    atlasNote: "Eleven Open Championships. Tony Jacklin's 1969 win. Bunkers everywhere — over 200 of them."
  },
  {
    id: 'wallasey-golf',
    name: 'Wallasey Golf Club',
    region: 'north_west',
    town: 'Wallasey, Wirral',
    type: 'course',
    format: '18-hole links',
    priceBand: '£££',
    youthPolicy: 'Junior memberships',
    website: 'https://www.wallaseygolf.com/',
    atlasNote: "Home of Stableford scoring — invented here in 1898. Undulating links with proper dunes."
  },
  {
    id: 'manchester-golf-club',
    name: 'Manchester Golf Club',
    region: 'north_west',
    town: 'Middleton, Manchester',
    type: 'course',
    format: '18-hole moorland',
    priceBand: '££',
    youthPolicy: 'Junior memberships, visitors welcome',
    website: 'https://www.mangc.co.uk/',
    atlasNote: "240 acres of Mancunian countryside, founded 1882. Mostly moorland with heathland touches. Deer drop in."
  },
  {
    id: 'heaton-park-golf',
    name: 'Heaton Park Golf Course',
    region: 'north_west',
    town: 'Manchester (M25)',
    type: 'course',
    format: '18-hole municipal · JH Taylor design',
    priceBand: '£',
    youthPolicy: 'Public, ridiculous value, juniors welcome',
    website: 'https://www.heatonparkgolfcourse.com/',
    atlasNote: "JH Taylor design (5-time Open champion). Public course in a famous Manchester park. Pay-and-play — and the lowest green fees in town."
  },
  {
    id: 'sale-golf',
    name: 'Sale Golf Club',
    region: 'north_west',
    town: 'Sale, Manchester',
    type: 'course',
    format: '18-hole parkland',
    priceBand: '££',
    youthPolicy: 'Junior memberships',
    website: 'https://salegolfclub.com/',
    atlasNote: "South Manchester parkland — gently undulating, friendly, reasonable fees. The local favourite."
  },
  {
    id: 'silloth-on-solway',
    name: 'Silloth on Solway Golf Club',
    region: 'north_west',
    town: 'Silloth, Cumbria',
    type: 'course',
    format: '18-hole championship links',
    priceBand: '£££',
    youthPolicy: 'Junior memberships',
    website: 'https://www.sillothgolfclub.co.uk/',
    atlasNote: "Cumbria's links secret. Atlantic-style golf without the Atlantic — across the Solway Firth from Scotland."
  },
  {
    id: 'windermere-golf',
    name: 'Windermere Golf Club',
    region: 'north_west',
    town: 'Windermere, Cumbria',
    type: 'course',
    format: '18-hole upland',
    priceBand: '££',
    youthPolicy: 'Visitors welcome, junior rates',
    website: 'https://www.windermeregolfclub.co.uk/',
    atlasNote: "Lake District golf — uphill, downhill, breathtaking views. Bring the camera."
  },
  {
    id: 'junkyard-manchester',
    name: 'Junkyard Golf Club — Manchester',
    region: 'north_west',
    town: 'Manchester',
    type: 'crazy',
    format: 'Indoor mini golf · 3 × 9-hole themed',
    priceBand: '££',
    youthPolicy: 'Family sessions before 7pm, then 18+',
    website: 'https://www.junkyardgolfclub.co.uk/',
    atlasNote: "The original Junkyard. Reclaimed-junk decor, neon, bars on every course. Family-time during the day."
  },
  {
    id: 'junkyard-liverpool',
    name: 'Junkyard Golf Club — Liverpool',
    region: 'north_west',
    town: 'Liverpool',
    type: 'crazy',
    format: 'Indoor mini golf · 3 × 9-hole themed',
    priceBand: '££',
    youthPolicy: 'Family sessions before 7pm, then 18+',
    website: 'https://www.junkyardgolfclub.co.uk/',
    atlasNote: "Junkyard's Liverpool venue. Same chaos, same energy, same daytime family hours."
  },
  {
    id: 'paradise-island-manchester',
    name: 'Paradise Island Adventure Golf — Trafford',
    region: 'north_west',
    town: 'Trafford Park, Manchester',
    type: 'crazy',
    format: 'Indoor mini golf · 2 × 18',
    priceBand: '£',
    youthPolicy: 'Family-first, all ages',
    website: 'https://www.adventuregolf.com/manchester/',
    atlasNote: "Tropical-themed indoor crazy golf right by Old Trafford. Make it a derby day double."
  },

  /* ============================================================
     NORTH EAST — Newcastle, Yorkshire
     ============================================================ */
  {
    id: 'ganton-golf',
    name: 'Ganton Golf Club',
    region: 'north_east',
    town: 'Ganton, North Yorkshire',
    type: 'course',
    format: '18-hole inland · 1949 Ryder Cup venue',
    priceBand: '£££',
    youthPolicy: 'Junior memberships',
    website: 'https://www.gantongolfclub.com/',
    atlasNote: "Often cited as England's best inland course. 1949 Ryder Cup, 2003 Walker Cup. Heather, gorse, real golf."
  },
  {
    id: 'alwoodley-golf',
    name: 'Alwoodley Golf Club',
    region: 'north_east',
    town: 'Leeds, West Yorkshire',
    type: 'course',
    format: '18-hole heathland · Alister MacKenzie 1907',
    priceBand: '£££',
    youthPolicy: 'Junior memberships',
    website: 'https://www.alwoodley.co.uk/',
    atlasNote: "Alister MacKenzie's first course design — the man who later did Augusta National. Heathland masterclass."
  },
  {
    id: 'moortown-golf',
    name: 'Moortown Golf Club',
    region: 'north_east',
    town: 'Leeds, West Yorkshire',
    type: 'course',
    format: '18-hole heathland · 1929 Ryder Cup venue',
    priceBand: '£££',
    youthPolicy: 'Junior memberships',
    website: 'https://www.moortown-gc.co.uk/',
    atlasNote: "First-ever Ryder Cup on British soil (1929). MacKenzie heathland next door to Alwoodley."
  },
  {
    id: 'fulford-golf',
    name: 'Fulford Golf Club',
    region: 'north_east',
    town: 'York',
    type: 'course',
    format: '18-hole parkland · European Tour history',
    priceBand: '££',
    youthPolicy: 'Junior memberships',
    website: 'https://www.fulfordgolfclub.co.uk/',
    atlasNote: "York's European Tour venue throughout the 80s. Tree-lined, classic parkland, friendly clubhouse."
  },
  {
    id: 'close-house-newcastle',
    name: 'Close House',
    region: 'north_east',
    town: 'Newcastle',
    type: 'course',
    format: '2 × 18-hole + 6-hole short course',
    priceBand: '£££',
    youthPolicy: 'Junior coaching, family rates',
    website: 'https://www.closehouse.com/',
    atlasNote: "Rory McIlroy's UK base. Hosted the British Masters twice. Two championship courses plus a short course."
  },
  {
    id: 'slaley-hall-hunting',
    name: 'Slaley Hall — Hunting Course',
    region: 'north_east',
    town: 'Hexham, Northumberland',
    type: 'course',
    format: '18-hole · resort',
    priceBand: '£££',
    youthPolicy: 'Family resort, junior access',
    website: 'https://www.slaleyhall.co.uk/golf/',
    atlasNote: "Resort golf with championship pedigree. The Hunting course is the headline."
  },
  {
    id: 'alnmouth-golf',
    name: 'Alnmouth Golf Club (Foxton Hall)',
    region: 'north_east',
    town: 'Alnmouth, Northumberland',
    type: 'course',
    format: '18-hole links',
    priceBand: '££',
    youthPolicy: 'Junior memberships',
    website: 'https://www.alnmouthgolfclub.com/',
    atlasNote: "Coastal links on Northumberland's North Sea coast. Wind, history, dramatic views."
  },
  {
    id: 'dunstanburgh-castle-golf',
    name: 'Dunstanburgh Castle Golf Club',
    region: 'north_east',
    town: 'Embleton, Northumberland',
    type: 'course',
    format: '18-hole links · Par 70',
    priceBand: '£',
    youthPolicy: 'Public access, junior rates',
    website: 'https://www.dunstanburgh.com/',
    atlasNote: "Links golf with a castle ruin as a backdrop. Brutally cheap for what it is. £27-£31 a round."
  },
  {
    id: 'gosforth-park-golf',
    name: 'Gosforth Park Golf Club',
    region: 'north_east',
    town: 'Newcastle',
    type: 'course',
    format: '18-hole parkland',
    priceBand: '££',
    youthPolicy: 'Visitors welcome',
    website: 'https://www.parklandgolfclub.co.uk/',
    atlasNote: "Newcastle parkland set within the racecourse. 10 minutes from city centre."
  },
  {
    id: 'junkyard-leeds',
    name: 'Junkyard Golf Club — Leeds',
    region: 'north_east',
    town: 'Leeds',
    type: 'crazy',
    format: 'Indoor mini golf · 3 × 9-hole themed',
    priceBand: '££',
    youthPolicy: 'Family sessions before 7pm, then 18+',
    website: 'https://www.junkyardgolfclub.co.uk/',
    atlasNote: "Leeds Junkyard. Same junkyard energy, three themed courses, daytime family hours."
  },
  {
    id: 'junkyard-newcastle',
    name: 'Junkyard Golf Club — Newcastle',
    region: 'north_east',
    town: 'Newcastle',
    type: 'crazy',
    format: 'Indoor mini golf · 3 × 9-hole themed',
    priceBand: '££',
    youthPolicy: 'Family sessions before 7pm, then 18+',
    website: 'https://www.junkyardgolfclub.co.uk/',
    atlasNote: "Newcastle Junkyard. Bozo (circus), Gary (90s disco), Pablo (jungle) — pick your poison."
  },
  {
    id: 'volcano-falls-castleford',
    name: 'Volcano Falls Adventure Golf — Castleford',
    region: 'north_east',
    town: 'Castleford, West Yorkshire',
    type: 'crazy',
    format: 'Indoor mini golf · 2 × 18',
    priceBand: '£',
    youthPolicy: 'Family-first, all ages',
    website: 'https://www.volcanofalls.co.uk/',
    atlasNote: "Prehistoric-themed indoor mini golf at Xscape Castleford. Dinosaurs, twists, food. Family day fixed."
  },

  /* ============================================================
     WALES
     ============================================================ */
  {
    id: 'royal-porthcawl',
    name: 'Royal Porthcawl Golf Club',
    region: 'wales',
    town: 'Porthcawl, Bridgend',
    type: 'course',
    format: '18-hole links · Top 100 world',
    priceBand: '££££',
    youthPolicy: 'Visitor access limited, junior rates',
    website: 'https://www.royalporthcawl.com/',
    atlasNote: "Wales' #1 course. World top 100. Sea views from every hole — no dune corridors to block them."
  },
  {
    id: 'celtic-manor-2010',
    name: 'Celtic Manor — Twenty Ten Course',
    region: 'wales',
    town: 'Newport',
    type: 'course',
    format: '18-hole · 2010 Ryder Cup venue',
    priceBand: '£££',
    youthPolicy: 'Junior coaching, family rates',
    website: 'https://www.celtic-manor.com/',
    atlasNote: "2010 Ryder Cup venue. The only course in the world built specifically to host the Ryder Cup."
  },
  {
    id: 'celtic-manor-mini',
    name: 'Celtic Manor — Mini Golf',
    region: 'wales',
    town: 'Newport',
    type: 'crazy',
    format: '2 × 9-hole mini golf',
    priceBand: '£',
    youthPolicy: 'Open to all, no booking required',
    website: 'https://www.celtic-manor.com/',
    atlasNote: "Two themed crazy courses at the Ryder Cup resort: Celtic Challenge + Kingdom of Legends. No hotel booking needed."
  },
  {
    id: 'royal-st-davids',
    name: "Royal St David's Golf Club",
    region: 'wales',
    town: 'Harlech, Gwynedd',
    type: 'course',
    format: '18-hole links',
    priceBand: '£££',
    youthPolicy: 'Junior memberships',
    website: 'https://www.royalstdavids.co.uk/',
    atlasNote: "Links by Harlech Castle. Dunes one side, mountains the other. One of Wales' finest."
  },
  {
    id: 'aberdovey-golf',
    name: 'Aberdovey Golf Club',
    region: 'wales',
    town: 'Aberdovey, Gwynedd',
    type: 'course',
    format: '18-hole links',
    priceBand: '££',
    youthPolicy: 'Junior memberships',
    website: 'https://www.aberdoveygolf.co.uk/',
    atlasNote: "Bernard Darwin's 'finest of all'. Quiet, pure, Cambrian-coast links."
  },
  {
    id: 'nefyn-golf',
    name: 'Nefyn & District Golf Club',
    region: 'wales',
    town: 'Pwllheli, Gwynedd',
    type: 'course',
    format: '27-hole clifftop links',
    priceBand: '££',
    youthPolicy: 'Junior memberships',
    website: 'https://www.nefyn-golf-club.com/',
    atlasNote: "Clifftop links, often compared to Pebble Beach. The 'Point' nine plays out onto a peninsula."
  },
  {
    id: 'pennard-golf',
    name: 'Pennard Golf Club',
    region: 'wales',
    town: 'Swansea',
    type: 'course',
    format: '18-hole links',
    priceBand: '££',
    youthPolicy: 'Junior memberships',
    website: 'https://www.pennardgolfclub.com/',
    atlasNote: "Top 100 GB&I. 'Links in the sky' — high above Three Cliffs Bay on the Gower."
  },
  {
    id: 'treetop-cardiff',
    name: 'Treetop Adventure Golf — Cardiff',
    region: 'wales',
    town: 'Cardiff',
    type: 'crazy',
    format: 'Indoor jungle-themed mini golf',
    priceBand: '£',
    youthPolicy: 'Family-first, all ages',
    website: 'https://www.treetopgolf.com/cardiff/',
    atlasNote: "Indoor jungle-themed crazy golf in St David's shopping centre. Rainy-day saviour."
  },

  /* ============================================================
     SCOTLAND
     ============================================================ */
  {
    id: 'st-andrews-old',
    name: 'St Andrews — Old Course',
    region: 'scotland',
    town: 'St Andrews, Fife',
    type: 'course',
    format: '18-hole links · The Home of Golf',
    priceBand: '££££',
    youthPolicy: 'Handicap certificate required, junior rates',
    website: 'https://www.standrews.com/',
    atlasNote: "The Home of Golf. Public links since the 1400s. Tee times via daily ballot or 6 months ahead."
  },
  {
    id: 'st-andrews-new',
    name: 'St Andrews — New Course',
    region: 'scotland',
    town: 'St Andrews, Fife',
    type: 'course',
    format: '18-hole links',
    priceBand: '£££',
    youthPolicy: 'Easier to book than the Old',
    website: 'https://www.standrews.com/',
    atlasNote: "The New (from 1895 — so not that new). Many locals say it plays better than the Old."
  },
  {
    id: 'st-andrews-jubilee',
    name: 'St Andrews — Jubilee Course',
    region: 'scotland',
    town: 'St Andrews, Fife',
    type: 'course',
    format: '18-hole links',
    priceBand: '£££',
    youthPolicy: 'Often easiest to book of the seven',
    website: 'https://www.standrews.com/',
    atlasNote: "Toughest of the seven St Andrews courses. Atlantic Bay views. Underrated."
  },
  {
    id: 'st-andrews-balgove',
    name: 'St Andrews — Balgove Course',
    region: 'scotland',
    town: 'St Andrews, Fife',
    type: 'pitchputt',
    format: '9-hole beginner course',
    priceBand: '£',
    youthPolicy: 'Designed for kids and beginners',
    website: 'https://www.standrews.com/',
    atlasNote: "The 9-hole Balgove is the St Andrews course built for kids and beginners. Children play free with a paying adult."
  },
  {
    id: 'kingsbarns',
    name: 'Kingsbarns Golf Links',
    region: 'scotland',
    town: 'Kingsbarns, Fife',
    type: 'course',
    format: '18-hole links',
    priceBand: '££££',
    youthPolicy: 'Visitor-friendly, premium pricing',
    website: 'https://www.kingsbarns.com/',
    atlasNote: "Modern links, 2000-built but feels ancient. Co-host of the Alfred Dunhill Links Championship."
  },
  {
    id: 'carnoustie',
    name: 'Carnoustie Golf Links',
    region: 'scotland',
    town: 'Carnoustie, Angus',
    type: 'course',
    format: '3 × 18-hole links · Open venue',
    priceBand: '££££',
    youthPolicy: 'Junior rates available',
    website: 'https://www.carnoustiegolflinks.com/',
    atlasNote: "Most brutal of the Open rota. Where Van de Velde came undone on the 18th. Three courses — the Burnside and Buddon are more affordable."
  },
  {
    id: 'muirfield',
    name: 'Muirfield (Honourable Company)',
    region: 'scotland',
    town: 'Gullane, East Lothian',
    type: 'course',
    format: '18-hole links · Open venue',
    priceBand: '££££',
    youthPolicy: 'Visitor days limited, dress code strict',
    website: 'https://www.muirfield.org.uk/',
    atlasNote: "World top 5. Open Championship venue. Limited visitor days — but the experience is the experience."
  },
  {
    id: 'gleneagles-kings',
    name: "Gleneagles — King's Course",
    region: 'scotland',
    town: 'Auchterarder, Perthshire',
    type: 'course',
    format: '18-hole moorland',
    priceBand: '££££',
    youthPolicy: 'Family resort, junior coaching',
    website: 'https://www.gleneagles.com/golf/',
    atlasNote: "James Braid 1919. Gleneagles' classic moorland course. The PGA Centenary (next door) hosted the 2014 Ryder Cup."
  },
  {
    id: 'royal-troon',
    name: 'Royal Troon Golf Club',
    region: 'scotland',
    town: 'Troon, Ayrshire',
    type: 'course',
    format: '18-hole links · Open venue',
    priceBand: '££££',
    youthPolicy: 'Visitor access limited',
    website: 'https://www.royaltroon.com/',
    atlasNote: "Open Championship venue (2024). Home of the famous Postage Stamp par-3 8th."
  },
  {
    id: 'turnberry-ailsa',
    name: 'Trump Turnberry — Ailsa Course',
    region: 'scotland',
    town: 'Turnberry, Ayrshire',
    type: 'course',
    format: '18-hole links · former Open venue',
    priceBand: '££££',
    youthPolicy: 'Junior rates, family resort',
    website: 'https://www.turnberry.co.uk/',
    atlasNote: "Lighthouse, Ailsa Craig, and the most photographed 9th tee in golf. Former Open venue."
  },
  {
    id: 'north-berwick-west',
    name: 'North Berwick West Links',
    region: 'scotland',
    town: 'North Berwick, East Lothian',
    type: 'course',
    format: '18-hole links',
    priceBand: '£££',
    youthPolicy: 'Visitor-friendly, junior rates',
    website: 'https://www.northberwickgolfclub.com/',
    atlasNote: "Quirky, brilliant, ancient links. The Redan 15th is the most copied hole in world golf."
  },
  {
    id: 'topgolf-glasgow',
    name: 'Topgolf — Glasgow',
    region: 'scotland',
    town: 'Glasgow',
    type: 'topgolf',
    format: 'Topgolf bays · 3 floors',
    priceBand: '££',
    youthPolicy: 'All ages welcome, junior pricing',
    website: 'https://topgolf.com/uk/glasgow/',
    atlasNote: "Scotland's only Topgolf. Three floors, tracked balls, music, food. Rangefinders and skill not required."
  },
  {
    id: 'i-like-big-putts-edinburgh',
    name: 'I Like Big Putts — Edinburgh',
    region: 'scotland',
    town: 'Edinburgh',
    type: 'crazy',
    format: 'Indoor mini golf · 14-hole',
    priceBand: '£',
    youthPolicy: 'Family-first, all ages',
    website: 'https://www.lane7.co.uk/edinburgh/',
    atlasNote: "Indoor mini golf at St James Quarter. Pinball machine hole 14. Lane7's bowling complex above."
  },
  {
    id: 'paradise-island-glasgow',
    name: 'Paradise Island Adventure Golf — Glasgow',
    region: 'scotland',
    town: 'Glasgow',
    type: 'crazy',
    format: 'Indoor mini golf · 2 × 18',
    priceBand: '£',
    youthPolicy: 'Family-first, all ages',
    website: 'https://www.adventuregolf.com/glasgow/',
    atlasNote: "Tropical-themed indoor crazy golf. The original Paradise Island. 20,000 sq ft."
  },
  {
    id: 'volcano-falls-edinburgh',
    name: 'Volcano Falls Adventure Golf — Edinburgh',
    region: 'scotland',
    town: 'Edinburgh',
    type: 'crazy',
    format: 'Indoor mini golf · 2 × 18',
    priceBand: '£',
    youthPolicy: 'Family-first, all ages',
    website: 'https://www.volcanofalls.co.uk/',
    atlasNote: "Prehistoric-themed indoor mini golf. Two 18-hole courses. Food and bars on site."
  },

  /* ============================================================
     NORTHERN IRELAND
     ============================================================ */
  {
    id: 'royal-county-down',
    name: 'Royal County Down Golf Club',
    region: 'ni',
    town: 'Newcastle, County Down',
    type: 'course',
    format: '18-hole links · World #1',
    priceBand: '££££',
    youthPolicy: 'Visitor days limited',
    website: 'https://www.royalcountydown.org/',
    atlasNote: "World #1 according to Golf Digest. Mourne Mountains behind. The most photographed 9th tee in all of golf."
  },
  {
    id: 'royal-portrush-dunluce',
    name: 'Royal Portrush — Dunluce Links',
    region: 'ni',
    town: 'Portrush, County Antrim',
    type: 'course',
    format: '18-hole links · Open venue',
    priceBand: '££££',
    youthPolicy: 'Junior rates available',
    website: 'https://www.royalportrushgolfclub.com/',
    atlasNote: "Three-time Open Championship venue. World top 10. Scottie Scheffler won here in 2025."
  },
  {
    id: 'royal-portrush-valley',
    name: 'Royal Portrush — Valley Course',
    region: 'ni',
    town: 'Portrush, County Antrim',
    type: 'course',
    format: '18-hole links',
    priceBand: '£££',
    youthPolicy: 'Junior rates, easier to access than Dunluce',
    website: 'https://www.royalportrushgolfclub.com/',
    atlasNote: "Dunluce's underrated sibling. Half the price of Dunluce, some say more enjoyable."
  },
  {
    id: 'portstewart-strand',
    name: 'Portstewart Golf Club — Strand',
    region: 'ni',
    town: 'Portstewart, County Londonderry',
    type: 'course',
    format: '18-hole links',
    priceBand: '£££',
    youthPolicy: 'Visitor-friendly, junior rates',
    website: 'https://www.portstewartgc.co.uk/',
    atlasNote: "Jon Rahm won the 2017 Irish Open here. One of the great opening holes in golf — the Strand's first."
  },
  {
    id: 'ardglass-golf',
    name: 'Ardglass Golf Club',
    region: 'ni',
    town: 'Ardglass, County Down',
    type: 'course',
    format: '18-hole clifftop links',
    priceBand: '££',
    youthPolicy: 'Junior memberships',
    website: 'https://www.ardglassgolfclub.com/',
    atlasNote: "Clifftop links with a 12th-century castle as the clubhouse. Atlantic views, sea spray, real character."
  },
  {
    id: 'castlerock-mussenden',
    name: 'Castlerock Golf Club — Mussenden',
    region: 'ni',
    town: 'Castlerock, County Londonderry',
    type: 'course',
    format: '18-hole links + 9-hole Bann',
    priceBand: '££',
    youthPolicy: 'Junior memberships',
    website: 'https://www.castlerockgc.co.uk/',
    atlasNote: "Causeway Coast links. The 9-hole Bann course alongside is brilliant for less-experienced players."
  },
  {
    id: 'lough-erne-faldo',
    name: 'Lough Erne Resort — Faldo Course',
    region: 'ni',
    town: 'Enniskillen, Fermanagh',
    type: 'course',
    format: '18-hole · Faldo design',
    priceBand: '£££',
    youthPolicy: 'Family resort, junior access',
    website: 'https://www.lougherneresort.com/',
    atlasNote: "Nick Faldo design on the shores of Lough Erne. Quieter part of NI, properly beautiful golf."
  }
];

/* ============================================================
   HELPER: convenient ways to access the data
   ============================================================ */
window.LDN_VENUES_BY_REGION = {
  london: 'Greater London',
  south_east: 'South East',
  south_west: 'South West',
  midlands: 'Midlands',
  north_west: 'North West',
  north_east: 'North East / Yorkshire',
  wales: 'Wales',
  scotland: 'Scotland',
  ni: 'Northern Ireland'
};

window.LDN_VENUE_TYPES = {
  course: 'Golf course',
  range: 'Driving range',
  topgolf: 'Topgolf-style',
  crazy: 'Crazy / mini golf',
  adventure: 'Adventure golf',
  pitchputt: 'Pitch & putt',
  indoor: 'Indoor sim'
};

window.LDN_REGION_ORDER = ['london','south_east','south_west','midlands','north_west','north_east','wales','scotland','ni'];

// Quick helper for the scorecard: returns courses suitable for scoring
// (excludes pure ranges, crazy golf, Topgolf — score-able formats only)
window.LDN_SCOREABLE_VENUES = function() {
  return window.LDN_VENUES.filter(v =>
    v.type === 'course' || v.type === 'pitchputt'
  );
};
