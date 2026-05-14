/**
 * Verified cities database — organized by continent.
 *
 * VERIFICATION LOGIC (in isVerifiedCity):
 *   Country NOT in DB    → ACCEPT (we have no data to check against)
 *   City NOT in country  → ACCEPT (might be a small real city we don't track)
 *   City IS tracked      → CHECK admin1 matches a valid region
 *   admin1 DOESN'T match → REJECT (fake duplicate like "Hyderabad, Punjab, PK")
 *
 * So this database ONLY causes rejections for KNOWN fakes.
 * Unknown cities in unknown countries always pass through.
 */

export const CITY_DB: Record<string, Record<string, string[]>> = {

  // ╔════════════════════════════════════════════════════════════════╗
  // ║  ASIA                                                         ║
  // ╚════════════════════════════════════════════════════════════════╝

  // ── Pakistan (Wikipedia 2023 Census) ──
  pk: {
    karachi: ['sindh'],
    hyderabad: ['sindh'],
    sukkur: ['sindh'],
    larkana: ['sindh'],
    nawabshah: ['sindh'],
    mirpurkhas: ['sindh'],
    jacobabad: ['sindh'],
    shikarpur: ['sindh'],
    dadu: ['sindh'],
    khairpur: ['sindh'],
    thatta: ['sindh'],
    badin: ['sindh'],
    ghotki: ['sindh'],
    tandoadam: ['sindh'],
    tandoallayar: ['sindh'],
    umarkot: ['sindh'],
    kashmore: ['sindh'],
    ratodero: ['sindh'],
    sehwan: ['sindh'],
    matiari: ['sindh'],
    jamshoro: ['sindh'],
    mithi: ['sindh'],
    lahore: ['punjab'],
    faisalabad: ['punjab'],
    rawalpindi: ['punjab'],
    gujranwala: ['punjab'],
    multan: ['punjab'],
    sargodha: ['punjab'],
    sialkot: ['punjab'],
    bahawalpur: ['punjab'],
    jhang: ['punjab'],
    sheikhupura: ['punjab'],
    gujrat: ['punjab'],
    sahiwal: ['punjab'],
    okara: ['punjab'],
    rahim: ['punjab'],
    kasur: ['punjab'],
    vehari: ['punjab'],
    muzaffargarh: ['punjab'],
    hafizabad: ['punjab'],
    khanewal: ['punjab'],
    chiniot: ['punjab'],
    dera: ['punjab'],
    toba: ['punjab'],
    kamoke: ['punjab'],
    mandi: ['punjab'],
    sadiqabad: ['punjab'],
    muridke: ['punjab'],
    gojra: ['punjab'],
    wazirabad: ['punjab'],
    gujarkhan: ['punjab'],
    kharian: ['punjab'],
    pasrur: ['punjab'],
    pattoki: ['punjab'],
    daska: ['punjab'],
    narowal: ['punjab'],
    nankana: ['punjab'],
    pakpattan: ['punjab'],
    rajanpur: ['punjab'],
    layyah: ['punjab'],
    lodhran: ['punjab'],
    bhakkar: ['punjab'],
    mianwali: ['punjab'],
    attock: ['punjab'],
    jhelum: ['punjab'],
    khushab: ['punjab'],
    burewala: ['punjab'],
    peshawar: ['khyber', 'pakhtunkhwa'],
    mardan: ['khyber', 'pakhtunkhwa'],
    mingora: ['khyber', 'pakhtunkhwa'],
    abbottabad: ['khyber', 'pakhtunkhwa'],
    kohat: ['khyber', 'pakhtunkhwa'],
    swabi: ['khyber', 'pakhtunkhwa'],
    nowshera: ['khyber', 'pakhtunkhwa'],
    charsadda: ['khyber', 'pakhtunkhwa'],
    mansehra: ['khyber', 'pakhtunkhwa'],
    haripur: ['khyber', 'pakhtunkhwa'],
    bannu: ['khyber', 'pakhtunkhwa'],
    deraismail: ['khyber', 'pakhtunkhwa'],
    quetta: ['balochistan'],
    turbat: ['balochistan'],
    khuzdar: ['balochistan'],
    chaman: ['balochistan'],
    gwadar: ['balochistan'],
    islamabad: ['islamabad'],
    muzaffarabad: ['azad', 'kashmir'],
    kotli: ['azad', 'kashmir'],
    gilgit: ['gilgit', 'baltistan'],
    skardu: ['gilgit', 'baltistan'],
  },

  // ── India (Wikipedia Census 2011) ──
  in: {
    hyderabad: ['telangana'],
    secunderabad: ['telangana'],
    mumbai: ['maharashtra'],
    delhi: ['delhi'],
    bengaluru: ['karnataka'],
    bangalore: ['karnataka'],
    ahmedabad: ['gujarat'],
    chennai: ['tamil nadu'],
    kolkata: ['west bengal'],
    calcutta: ['west bengal'],
    surat: ['gujarat'],
    pune: ['maharashtra'],
    jaipur: ['rajasthan'],
    lucknow: ['uttar pradesh'],
    kanpur: ['uttar pradesh'],
    nagpur: ['maharashtra'],
    indore: ['madhya pradesh'],
    bhopal: ['madhya pradesh'],
    visakhapatnam: ['andhra pradesh'],
    patna: ['bihar'],
    vadodara: ['gujarat'],
    ghaziabad: ['uttar pradesh'],
    ludhiana: ['punjab'],
    agra: ['uttar pradesh'],
    nashik: ['maharashtra'],
    faridabad: ['haryana'],
    meerut: ['uttar pradesh'],
    rajkot: ['gujarat'],
    varanasi: ['uttar pradesh'],
    srinagar: ['jammu', 'kashmir'],
    amritsar: ['punjab'],
    chandigarh: ['chandigarh', 'punjab', 'haryana'],
    bhubaneswar: ['odisha'],
    thiruvananthapuram: ['kerala'],
    dehradun: ['uttarakhand'],
    shimla: ['himachal pradesh'],
    newdelhi: ['delhi'],
  },

  // ── China (Wikipedia) ──
  cn: {
    shanghai: ['shanghai'],
    beijing: ['beijing'],
    guangzhou: ['guangdong'],
    shenzhen: ['guangdong'],
    chengdu: ['sichuan'],
    wuhan: ['hubei'],
    hangzhou: ['zhejiang'],
    chongqing: ['chongqing'],
    nanjing: ['jiangsu'],
    tianjin: ['tianjin'],
    xian: ['shaanxi'],
    suzhou: ['jiangsu'],
    harbin: ['heilongjiang'],
    shenyang: ['liaoning'],
    dalian: ['liaoning'],
    qingdao: ['shandong'],
    zhengzhou: ['henan'],
    changsha: ['hunan'],
    kunming: ['yunnan'],
    foshan: ['guangdong'],
    dongguan: ['guangdong'],
    jinan: ['shandong'],
    hefei: ['anhui'],
    nanning: ['guangxi'],
    xiamen: ['fujian'],
    fuzhou: ['fujian'],
    changchun: ['jilin'],
    shijiazhuang: ['hebei'],
    nanchang: ['jiangxi'],
    taiyuan: ['shanxi'],
    guiyang: ['guizhou'],
    lanzhou: ['gansu'],
    urumqi: ['xinjiang'],
    haikou: ['hainan'],
    yinchuan: ['ningxia'],
    xining: ['qinghai'],
    hohhot: ['inner mongolia'],
    lhasa: ['tibet'],
  },

  // ── Japan ──
  jp: {
    tokyo: ['tokyo'],
    osaka: ['osaka'],
    kyoto: ['kyoto'],
    yokohama: ['kanagawa'],
    nagoya: ['aichi'],
    sapporo: ['hokkaido'],
    fukuoka: ['fukuoka'],
    kobe: ['hyogo'],
    sendai: ['miyagi'],
    hiroshima: ['hiroshima'],
  },

  // ── South Korea ──
  kr: {
    seoul: ['seoul'],
    busan: ['busan'],
    incheon: ['incheon'],
    daegu: ['daegu'],
    daejeon: ['daejeon'],
    gwangju: ['gwangju'],
    suwon: ['gyeonggi'],
    ulsan: ['ulsan'],
  },

  // ── Indonesia (Wikipedia) ──
  id: {
    jakarta: ['jakarta'],
    surabaya: ['east java', 'jawa timur'],
    bandung: ['west java', 'jawa barat'],
    medan: ['north sumatra', 'sumatera utara'],
    semarang: ['central java', 'jawa tengah'],
    makassar: ['south sulawesi', 'sulawesi selatan'],
    palembang: ['south sumatra', 'sumatera selatan'],
    denpasar: ['bali'],
    yogyakarta: ['yogyakarta'],
    bekasi: ['west java', 'jawa barat'],
    tangerang: ['banten'],
    depok: ['west java', 'jawa barat'],
    bogor: ['west java', 'jawa barat'],
    malang: ['east java', 'jawa timur'],
    pekanbaru: ['riau'],
    samarinda: ['east kalimantan', 'kalimantan timur'],
    balikpapan: ['east kalimantan', 'kalimantan timur'],
    padang: ['west sumatra', 'sumatera barat'],
    bandarlampung: ['lampung'],
    manado: ['north sulawesi', 'sulawesi utara'],
    batam: ['riau islands', 'kepulauan riau'],
    banjarmasin: ['south kalimantan', 'kalimantan selatan'],
  },

  // ── Bangladesh ──
  bd: {
    dhaka: ['dhaka'],
    chittagong: ['chittagong'],
    khulna: ['khulna'],
    rajshahi: ['rajshahi'],
    sylhet: ['sylhet'],
    rangpur: ['rangpur'],
    mymensingh: ['mymensingh'],
    comilla: ['comilla'],
    gazipur: ['dhaka'],
    narayanganj: ['narayanganj'],
  },

  // ── Philippines ──
  ph: {
    manila: ['metro manila', 'national capital region'],
    quezon: ['metro manila', 'national capital region'],
    davao: ['davao'],
    cebu: ['cebu'],
    zamboanga: ['zamboanga'],
  },

  // ── Vietnam ──
  vn: {
    hanoi: ['hanoi'],
    hochiminh: ['ho chi minh'],
    danang: ['da nang'],
    haiphong: ['hai phong'],
  },

  // ── Thailand ──
  th: {
    bangkok: ['bangkok'],
    chiangmai: ['chiang mai'],
    pattaya: ['chon buri'],
  },

  // ── Malaysia ──
  my: {
    kualalumpur: ['kuala lumpur', 'wilayah persekutuan kuala lumpur'],
    georgetown: ['pulau pinang', 'penang'],
    johorbahru: ['johor'],
    ipoh: ['perak'],
    shahalam: ['selangor'],
  },

  // ── Singapore ──
  sg: {
    singapore: ['singapore', 'central region', ''],
  },

  // ── Taiwan ──
  tw: {
    taipei: ['taipei'],
    kaohsiung: ['kaohsiung'],
    taichung: ['taichung'],
    tainan: ['tainan'],
  },

  // ── Nepal ──
  np: {
    kathmandu: ['bagmati'],
    pokhara: ['gandaki'],
    lalitpur: ['bagmati'],
  },

  // ── Sri Lanka ──
  lk: {
    colombo: ['western'],
    kandy: ['central'],
    galle: ['southern'],
    jaffna: ['northern'],
  },

  // ── Myanmar ──
  mm: {
    yangon: ['yangon'],
    mandalay: ['mandalay'],
    naypyidaw: ['naypyidaw'],
  },

  // ── Cambodia ──
  kh: {
    phnompenh: ['phnom penh'],
    siemreap: ['siem reap'],
  },

  // ── Laos ──
  la: {
    vientiane: ['vientiane'],
    luangprabang: ['luang prabang'],
  },

  // ── Iran ──
  ir: {
    tehran: ['tehran'],
    mashhad: ['razavi khorasan'],
    isfahan: ['isfahan'],
    tabriz: ['east azerbaijan'],
    shiraz: ['fars'],
  },

  // ── Iraq ──
  iq: {
    baghdad: ['baghdad'],
    basra: ['basra'],
    erbil: ['erbil'],
    mosul: ['nineveh'],
  },

  // ── Turkey ──
  tr: {
    istanbul: ['istanbul'],
    ankara: ['ankara'],
    izmir: ['izmir'],
    bursa: ['bursa'],
    antalya: ['antalya'],
  },

  // ── Saudi Arabia ──
  sa: {
    riyadh: ['riyadh'],
    jeddah: ['makkah', 'mecca'],
    mecca: ['makkah', 'mecca'],
    medina: ['madinah', 'medina'],
    dammam: ['eastern'],
  },

  // ── UAE ──
  ae: {
    dubai: ['dubai'],
    abudhabi: ['abu dhabi'],
    sharjah: ['sharjah'],
  },

  // ── Israel ──
  il: {
    jerusalem: ['jerusalem'],
    telaviv: ['tel aviv'],
    haifa: ['haifa'],
  },

  // ── Jordan ──
  jo: {
    amman: ['amman'],
    irbid: ['irbid'],
  },

  // ── Lebanon ──
  lb: {
    beirut: ['beirut'],
  },

  // ── Afghanistan ──
  af: {
    kabul: ['kabul'],
    herat: ['herat'],
    kandahar: ['kandahar'],
  },

  // ── Uzbekistan ──
  uz: {
    tashkent: ['tashkent'],
    samarkand: ['samarkand'],
    bukhara: ['bukhara'],
  },

  // ── Kazakhstan ──
  kz: {
    almaty: ['almaty'],
    astana: ['astana', 'aqmola'],
    shymkent: ['shymkent'],
  },

  // ── Azerbaijan ──
  az: {
    baku: ['baku'],
  },

  // ── Georgia ──
  ge: {
    tbilisi: ['tbilisi'],
    batumi: ['adjara'],
  },

  // ── Armenia ──
  am: {
    yerevan: ['yerevan'],
  },

  // ╔════════════════════════════════════════════════════════════════╗
  // ║  EUROPE                                                        ║
  // ╚════════════════════════════════════════════════════════════════╝

  // ── United Kingdom ──
  gb: {
    london: ['england'],
    birmingham: ['england'],
    manchester: ['england'],
    glasgow: ['scotland'],
    liverpool: ['england'],
    edinburgh: ['scotland'],
    bristol: ['england'],
    cardiff: ['wales'],
    belfast: ['northern ireland'],
    sheffield: ['england'],
    leeds: ['england'],
    oxford: ['england'],
    cambridge: ['england'],
    aberdeen: ['scotland'],
  },

  // ── Ireland ──
  ie: {
    dublin: ['leinster', 'dublin'],
    cork: ['munster', 'cork'],
    galway: ['connacht', 'galway'],
    limerick: ['munster', 'limerick'],
  },

  // ── France ──
  fr: {
    paris: ['île-de-france', 'ile-de-france'],
    marseille: ['provence-alpes-côte d\'azur'],
    lyon: ['auvergne-rhône-alpes'],
    toulouse: ['occitanie'],
    nice: ['provence-alpes-côte d\'azur'],
    bordeaux: ['nouvelle-aquitaine'],
    strasbourg: ['grand est'],
    nantes: ['pays de la loire'],
    montpellier: ['occitanie'],
    lille: ['hauts-de-france'],
    rennes: ['bretany', 'bretagne'],
  },

  // ── Germany ──
  de: {
    berlin: ['berlin'],
    hamburg: ['hamburg'],
    munich: ['bavaria', 'bayern'],
    cologne: ['north rhine-westphalia', 'nordrhein-westfalen'],
    frankfurt: ['hesse', 'hessen'],
    stuttgart: ['baden-württemberg'],
    düsseldorf: ['north rhine-westphalia', 'nordrhein-westfalen'],
    leipzig: ['saxony', 'sachsen'],
    dresden: ['saxony', 'sachsen'],
    hannover: ['lower saxony', 'niedersachsen'],
    nuremberg: ['bavaria', 'bayern'],
  },

  // ── Italy ──
  it: {
    rome: ['lazio'],
    milan: ['lombardy', 'lombardia'],
    naples: ['campania'],
    turin: ['piedmont', 'piemonte'],
    florence: ['tuscany', 'toscana'],
    venice: ['veneto'],
    bologna: ['emilia-romagna'],
    genoa: ['liguria'],
    palermo: ['sicily', 'sicilia'],
  },

  // ── Spain ──
  es: {
    madrid: ['madrid', 'community of madrid'],
    barcelona: ['catalonia', 'catalunya'],
    valencia: ['valencia'],
    seville: ['andalusia', 'andalucía'],
    zaragoza: ['aragon', 'aragón'],
    malaga: ['andalusia', 'andalucía'],
    bilbao: ['basque country'],
  },

  // ── Portugal ──
  pt: {
    lisbon: ['lisbon', 'lisboa'],
    porto: ['porto'],
    faro: ['faro'],
  },

  // ── Netherlands ──
  nl: {
    amsterdam: ['north holland', 'noord-holland'],
    rotterdam: ['south holland', 'zuid-holland'],
    thehague: ['south holland', 'zuid-holland'],
    utrecht: ['utrecht'],
    eindhoven: ['north brabant', 'noord-brabant'],
  },

  // ── Belgium ──
  be: {
    brussels: ['brussels', 'bruxelles', 'brussel'],
    antwerp: ['antwerp', 'antwerpen'],
    ghent: ['east flanders', 'oost-vlaanderen'],
  },

  // ── Switzerland ──
  ch: {
    zurich: ['zurich', 'zürich'],
    geneva: ['geneva'],
    basel: ['basel-stadt'],
    bern: ['bern'],
  },

  // ── Austria ──
  at: {
    vienna: ['vienna', 'wien'],
    graz: ['styria', 'steiermark'],
    linz: ['upper austria', 'oberösterreich'],
    salzburg: ['salzburg'],
  },

  // ── Poland ──
  pl: {
    warsaw: ['mazovia', 'mazowieckie'],
    krakow: ['lesser poland', 'małopolskie'],
    wroclaw: ['lower silesia', 'dolnośląskie'],
    gdansk: ['pomerania', 'pomorskie'],
  },

  // ── Czech Republic ──
  cz: {
    prague: ['prague'],
    brno: ['south moravian'],
  },

  // ── Sweden ──
  se: {
    stockholm: ['stockholm'],
    gothenburg: ['västra götaland'],
  },

  // ── Norway ──
  'no': {
    oslo: ['oslo'],
    bergen: ['vestland'],
  },

  // ── Denmark ──
  dk: {
    copenhagen: ['capital region', 'hovedstaden'],
    aarhus: ['central denmark'],
  },

  // ── Finland ──
  fi: {
    helsinki: ['uusimaa'],
  },

  // ── Greece ──
  gr: {
    athens: ['attica'],
    thessaloniki: ['central macedonia'],
  },

  // ── Hungary ──
  hu: {
    budapest: ['budapest'],
  },

  // ── Romania ──
  ro: {
    bucharest: ['bucharest', 'bucurești'],
    cluj: ['cluj'],
  },

  // ── Ukraine ──
  ua: {
    kyiv: ['kyiv', 'kiev'],
    kharkiv: ['kharkiv'],
    odesa: ['odesa', 'odessa'],
    lviv: ['lviv'],
  },

  // ── Russia ──
  ru: {
    moscow: ['moscow'],
    stpetersburg: ['saint petersburg'],
    novosibirsk: ['novosibirsk'],
    kazan: ['tatarstan'],
  },

  // ╔════════════════════════════════════════════════════════════════╗
  // ║  NORTH AMERICA                                                 ║
  // ╚════════════════════════════════════════════════════════════════╝

  // ── United States ──
  us: {
    newyork: ['new york'],
    losangeles: ['california'],
    chicago: ['illinois'],
    houston: ['texas'],
    phoenix: ['arizona'],
    philadelphia: ['pennsylvania'],
    sanantonio: ['texas'],
    sandiego: ['california'],
    dallas: ['texas'],
    austin: ['texas'],
    jacksonville: ['florida'],
    sanfrancisco: ['california'],
    seattle: ['washington'],
    denver: ['colorado'],
    boston: ['massachusetts'],
    nashville: ['tennessee'],
    detroit: ['michigan'],
    portland: ['oregon', 'maine'],
    lasvegas: ['nevada'],
    miami: ['florida'],
    atlanta: ['georgia'],
    washington: ['district of columbia'],
    // Cities with collisions (appear in multiple states)
    london: ['ohio', 'kentucky', 'connecticut', 'michigan', 'minnesota', 'new hampshire', 'new york', 'oregon', 'tennessee', 'texas', 'wisconsin'],
    rochester: ['new york', 'minnesota'],
    springfield: ['illinois', 'massachusetts', 'missouri', 'oregon'],
    manchester: ['new hampshire', 'connecticut'],
    cambridge: ['massachusetts'],
    oxford: ['mississippi', 'ohio'],
  },

  // ── Canada ──
  ca: {
    toronto: ['ontario'],
    montreal: ['québec', 'quebec'],
    vancouver: ['british columbia'],
    calgary: ['alberta'],
    edmonton: ['alberta'],
    ottawa: ['ontario'],
    winnipeg: ['manitoba'],
    halifax: ['nova scotia'],
    victoria: ['british columbia'],
    london: ['ontario'],
    regina: ['saskatchewan'],
    saskatoon: ['saskatchewan'],
  },

  // ── Mexico ──
  mx: {
    mexicocity: ['ciudad de méxico'],
    guadalajara: ['jalisco'],
    monterrey: ['nuevo león', 'nuevo leon'],
    puebla: ['puebla'],
    tijuana: ['baja california'],
    cancun: ['quintana roo'],
    merida: ['yucatán'],
  },

  // ── Cuba ──
  cu: {
    havana: ['la habana', 'havana'],
  },

  // ╔════════════════════════════════════════════════════════════════╗
  // ║  SOUTH AMERICA                                                 ║
  // ╚════════════════════════════════════════════════════════════════╝

  // ── Brazil (Wikipedia 2022 Census) ──
  br: {
    saopaulo: ['são paulo', 'sao paulo'],
    riodejaneiro: ['rio de janeiro'],
    brasilia: ['distrito federal'],
    salvador: ['bahia'],
    fortaleza: ['ceará', 'ceara'],
    belohorizonte: ['minas gerais'],
    manaus: ['amazonas'],
    curitiba: ['paraná', 'parana'],
    recife: ['pernambuco'],
    portoalegre: ['rio grande do sul'],
    belen: ['pará', 'para'],
    goiania: ['goiás', 'goias'],
  },

  // ── Argentina ──
  ar: {
    buenosaires: ['buenos aires'],
    cordoba: ['córdoba'],
    rosario: ['santa fe'],
    mendoza: ['mendoza'],
  },

  // ── Colombia ──
  co: {
    bogota: ['bogotá'],
    medellin: ['antioquia'],
    cali: ['valle del cauca'],
    barranquilla: ['atlántico'],
    cartagena: ['bolívar'],
  },

  // ── Chile ──
  cl: {
    santiago: ['santiago metropolitan', 'región metropolitana'],
  },

  // ── Peru ──
  pe: {
    lima: ['lima'],
    cusco: ['cusco'],
  },

  // ╔════════════════════════════════════════════════════════════════╗
  // ║  AFRICA                                                         ║
  // ╚════════════════════════════════════════════════════════════════╝

  // ── Egypt ──
  eg: {
    cairo: ['cairo'],
    alexandria: ['alexandria'],
    giza: ['giza'],
  },

  // ── Nigeria ──
  ng: {
    lagos: ['lagos'],
    abuja: ['federal capital territory'],
    kano: ['kano'],
    ibadan: ['oyo'],
  },

  // ── South Africa ──
  za: {
    johannesburg: ['gauteng'],
    capetown: ['western cape'],
    durban: ['kwazulu-natal'],
    pretoria: ['gauteng'],
  },

  // ── Kenya ──
  ke: {
    nairobi: ['nairobi'],
    mombasa: ['mombasa'],
  },

  // ── Morocco ──
  ma: {
    casablanca: ['casablanca-settat'],
    rabat: ['rabat-salé-kénitra'],
    marrakech: ['marrakech-safi'],
  },

  // ── Ethiopia ──
  et: {
    addisababa: ['addis ababa'],
  },

  // ── Tanzania ──
  tz: {
    daressalaam: ['dar es salaam'],
  },

  // ── Ghana ──
  gh: {
    accra: ['greater accra'],
  },

  // ── Algeria ──
  dz: {
    algiers: ['algiers'],
  },

  // ╔════════════════════════════════════════════════════════════════╗
  // ║  OCEANIA                                                        ║
  // ╚════════════════════════════════════════════════════════════════╝

  // ── Australia ──
  au: {
    sydney: ['new south wales'],
    melbourne: ['victoria'],
    brisbane: ['queensland'],
    perth: ['western australia'],
    adelaide: ['south australia'],
    canberra: ['australian capital territory'],
    hobart: ['tasmania'],
    darwin: ['northern territory'],
  },

  // ── New Zealand ──
  nz: {
    auckland: ['auckland'],
    wellington: ['wellington'],
    christchurch: ['canterbury'],
    hamilton: ['waikato'],
    dunedin: ['otago'],
  },
};

/**
 * EXCLUSIVE CITIES — belongs to ONE country only.
 *
 * If a search result has this city name but is in a DIFFERENT country → REJECT.
 *
 * "London" in GB → the REAL London → ACCEPT
 * "London" in CA, US, etc → fake duplicates → REJECT
 * "Paris" in FR → the REAL Paris → ACCEPT
 * "Paris" in US, etc → fake duplicates → REJECT
 */
const EXCLUSIVE_CITIES: Record<string, string> = {
  // England → GB only
  london: 'gb',
  oxford: 'gb',
  cambridge: 'gb',
  manchester: 'gb',
  birmingham: 'gb',
  liverpool: 'gb',
  bristol: 'gb',
  sheffield: 'gb',
  leeds: 'gb',
  brighton: 'gb',
  bath: 'gb',
  york: 'gb',
  reading: 'gb',
  // France → FR only
  paris: 'fr',
  lyon: 'fr',
  marseille: 'fr',
  toulouse: 'fr',
  nice: 'fr',
  bordeaux: 'fr',
  strasbourg: 'fr',
  nantes: 'fr',
  montpellier: 'fr',
  // Italy → IT only
  rome: 'it',
  milan: 'it',
  venice: 'it',
  florence: 'it',
  naples: 'it',
  // Spain → ES only
  barcelona: 'es',
  seville: 'es',
  // Germany → DE only
  berlin: 'de',
  hamburg: 'de',
  munich: 'de',
  cologne: 'de',
  frankfurt: 'de',
  // Russia → RU only
  moscow: 'ru',
  // Egypt → EG only
  cairo: 'es', // wrong, let me fix
  // Japan → JP only
  tokyo: 'jp',
  osaka: 'jp',
  kyoto: 'jp',
  // China → CN only
  beijing: 'cn',
  shanghai: 'cn',
  // Brazil → BR only
  riodejaneiro: 'br',
  // Australia → AU only
  sydney: 'au',
  melbourne: 'au',
  // Singapore → SG only
  singapore: 'sg',
  // Thailand → TH only
  bangkok: 'th',
  // Morocco → MA only
  marrakech: 'ma',
  // Greece → GR only
  athens: 'gr',
  // Portugal → PT only
  lisbon: 'pt',
  // Netherlands → NL only
  amsterdam: 'nl',
  // Czech → CZ only
  prague: 'cz',
  // Hungary → HU only
  budapest: 'hu',
  // Ireland → IE only
  dublin: 'ie',
  // Colombia → CO only
  bogota: 'co',
  // Peru → PE only
  lima: 'pe',
  // Israel → IL only
  jerusalem: 'il',
};

// Fix: Cairo belongs to Egypt
EXCLUSIVE_CITIES['cairo'] = 'eg';

/**
 * Check if a result is a verified real city.
 *
 * Step 1: EXCLUSIVE check — if this city name is exclusive to one country
 *   and the result is in a DIFFERENT country → REJECT immediately.
 *
 * Step 2: DATABASE check — if this city+country is in our database,
 *   verify the admin1/region matches.
 *
 * Step 3: If neither exclusive nor in database → ACCEPT (no data to verify).
 */
export function isVerifiedCity(
  name: string,
  countryCode: string,
  admin1: string,
): boolean {
  const cc = countryCode.toLowerCase().trim();
  const cityName = name.toLowerCase().trim().replace(/[\s-]+/g, '');
  const adminLower = admin1.toLowerCase().trim();

  // ── Step 1: Exclusive city check ──
  const exclusiveOwner = EXCLUSIVE_CITIES[cityName];
  if (exclusiveOwner && exclusiveOwner !== cc) {
    // This city name belongs to a different country → REJECT
    return false;
  }

  // ── Step 2: Database region check ──
  const countryDB = CITY_DB[cc];
  if (!countryDB) return true;                    // No data for country → accept
  const validRegions = countryDB[cityName];
  if (!validRegions) return true;                 // City not tracked → accept
  if (validRegions.length === 0) return true;     // Empty → accept any
  return validRegions.some(
    (r) => adminLower.includes(r) || r.includes(adminLower),
  );
}
