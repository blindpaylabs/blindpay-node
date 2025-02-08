export interface Receiver {
  id: string;
  type: ReceiverType;
  kyc_type: KYCType;
  email: string;
  tax_id: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state_province_region: string;
  country: CountryCode;
  postal_code: string;
  ip_address: string;
  image_url: string;
  phone_number: string;
  proof_of_address_doc_type: AddressDocType;
  proof_of_address_doc_file: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  id_doc_country: string;
  id_doc_type: IDDocType;
  id_doc_front_file: string;
  id_doc_back_file: string;
  legal_name: string;
  alternate_name: string;
  formation_date: string;
  website: string;
  owners: {
    first_name: string;
    last_name: string;
    role: string;
    date_of_birth: string;
    tax_id: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state_province_region: string;
    country: string;
    postal_code: string;
    id_doc_country: string;
    id_doc_type: IDDocType;
    id_doc_front_file: string;
    id_doc_back_file: string;
  }[];
  incorporation_doc_file: string;
  proof_of_ownership_doc_file: string;
  source_of_funds_doc_type: SourceOfFundsDocType;
  source_of_funds_doc_file: string;
  individual_holding_doc_front_file: string;
  purpose_of_transactions: PurposeOfTransactions;
  purpose_of_transactions_explanation: string;
  external_id: string;
}

export enum ReceiverType {
  INDIVIDUAL = "individual",
  BUSINESS = "business",
}

export enum KYCType {
  LIGHT = "light",
  STANDARD = "standard",
  ENHANCED = "enhanced",
}

export enum IDDocType {
  PASSPORT,
  ID_CARD,
  DRIVERS,
}

export enum SourceOfFundsDocType {
  BUSINESS_INCOME = "business_income",
  GAMBLING_PROCEEDS = "gambling_proceeds",
  GIFTS = "gifts",
  GOVERNMENT_BENEFITS = "government_benefits",
  INHERITANCE = "inheritance",
}

export enum PurposeOfTransactions {
  BUSINESS_TRANSACTIONS = "business_transactions",
  CHARITABLE_DONATIONS = "charitable_donations",
  INVESTMENT_PURPOSES = "investment_purposes",
  PAYMENTS_TO_FRIENDS_OR_FAMILY_ABROAD = "payments_to_friends_or_family_abroad",
  PERSONAL_OR_LIVING_EXPENSES = "personal_or_living_expenses",
  PROTECT_WEALTH = "protect_wealth",
  PURCHASE_GOODS_AND_SERVICES = "purchase_goods_and_services",
  RECEIVE_PAYMENT_FOR_FREELANCING = "receive_payment_for_freelancing",
  RECEIVE_SALARY = "receive_salary",
  OTHER = "other",
}

export enum AddressDocType {
  UTILITY_BILL,
  BANK_STATEMENT,
  RENTAL_AGREEMENT,
  TAX_DOCUMENT,
  GOVERNMENT_CORRESPONDENCE,
}

export enum CountryCode {
  Afghanistan = "AF",
  Albania = "AL",
  Algeria = "DZ",
  AmericanSamoa = "AS",
  Andorra = "AD",
  Angola = "AO",
  Anguilla = "AI",
  Antarctica = "AQ",
  AntiguaAndBarbuda = "AG",
  Argentina = "AR",
  Armenia = "AM",
  Aruba = "AW",
  Australia = "AU",
  Austria = "AT",
  Azerbaijan = "AZ",
  Bahamas = "BS",
  Bahrain = "BH",
  Bangladesh = "BD",
  Barbados = "BB",
  Belarus = "BY",
  Belgium = "BE",
  Belize = "BZ",
  Benin = "BJ",
  Bermuda = "BM",
  Bhutan = "BT",
  Bolivia = "BO",
  Bonaire = "BQ",
  BosniaAndHerzegovina = "BA",
  Botswana = "BW",
  BouvetIsland = "BV",
  Brazil = "BR",
  BritishIndianOceanTerritory = "IO",
  BruneiDarussalam = "BN",
  Bulgaria = "BG",
  BurkinaFaso = "BF",
  Burundi = "BI",
  CaboVerde = "CV",
  Cambodia = "KH",
  Cameroon = "CM",
  Canada = "CA",
  CaymanIslands = "KY",
  CentralAfricanRepublic = "CF",
  Chad = "TD",
  Chile = "CL",
  China = "CN",
  ChristmasIsland = "CX",
  CocosIslands = "CC",
  Colombia = "CO",
  Comoros = "KM",
  Congo = "CD",
  CongoRepublic = "CG",
  CookIslands = "CK",
  CostaRica = "CR",
  Croatia = "HR",
  Cuba = "CU",
  Curacao = "CW",
  Cyprus = "CY",
  CzechRepublic = "CZ",
  CoteDIvoire = "CI",
  Denmark = "DK",
  Djibouti = "DJ",
  Dominica = "DM",
  DominicanRepublic = "DO",
  Ecuador = "EC",
  Egypt = "EG",
  ElSalvador = "SV",
  EquatorialGuinea = "GQ",
  Eritrea = "ER",
  Estonia = "EE",
  Eswatini = "SZ",
  Ethiopia = "ET",
  FalklandIslands = "FK",
  FaroeIslands = "FO",
  Fiji = "FJ",
  Finland = "FI",
  France = "FR",
  FrenchGuiana = "GF",
  FrenchPolynesia = "PF",
  FrenchSouthernTerritories = "TF",
  Gabon = "GA",
  Gambia = "GM",
  Georgia = "GE",
  Germany = "DE",
  Ghana = "GH",
  Gibraltar = "GI",
  Greece = "GR",
  Greenland = "GL",
  Grenada = "GD",
  Guadeloupe = "GP",
  Guam = "GU",
  Guatemala = "GT",
  Guernsey = "GG",
  Guinea = "GN",
  GuineaBissau = "GW",
  Guyana = "GY",
  Haiti = "HT",
  HeardIslandAndMcDonaldIslands = "HM",
  HolySee = "VA",
  Honduras = "HN",
  HongKong = "HK",
  Hungary = "HU",
  Iceland = "IS",
  India = "IN",
  Indonesia = "ID",
  Iran = "IR",
  Iraq = "IQ",
  Ireland = "IE",
  IsleOfMan = "IM",
  Israel = "IL",
  Italy = "IT",
  Jamaica = "JM",
  Japan = "JP",
  Jersey = "JE",
  Jordan = "JO",
  Kazakhstan = "KZ",
  Kenya = "KE",
  Kiribati = "KI",
  KoreaNorth = "KP",
  KoreaSouth = "KR",
  Kuwait = "KW",
  Kyrgyzstan = "KG",
  Laos = "LA",
  Latvia = "LV",
  Lebanon = "LB",
  Lesotho = "LS",
  Liberia = "LR",
  Libya = "LY",
  Liechtenstein = "LI",
  Lithuania = "LT",
  Luxembourg = "LU",
  Macao = "MO",
  Madagascar = "MG",
  Malawi = "MW",
  Malaysia = "MY",
  Maldives = "MV",
  Mali = "ML",
  Malta = "MT",
  MarshallIslands = "MH",
  Martinique = "MQ",
  Mauritania = "MR",
  Mauritius = "MU",
  Mayotte = "YT",
  Mexico = "MX",
  Micronesia = "FM",
  Moldova = "MD",
  Monaco = "MC",
  Mongolia = "MN",
  Montenegro = "ME",
  Montserrat = "MS",
  Morocco = "MA",
  Mozambique = "MZ",
  Myanmar = "MM",
  Namibia = "NA",
  Nauru = "NR",
  Nepal = "NP",
  Netherlands = "NL",
  NewCaledonia = "NC",
  NewZealand = "NZ",
  Nicaragua = "NI",
  Niger = "NE",
  Nigeria = "NG",
  Niue = "NU",
  NorfolkIsland = "NF",
  NorthernMarianaIslands = "MP",
  Norway = "NO",
  Oman = "OM",
  Pakistan = "PK",
  Palau = "PW",
  Palestine = "PS",
  Panama = "PA",
  PapuaNewGuinea = "PG",
  Paraguay = "PY",
  Peru = "PE",
  Philippines = "PH",
  Pitcairn = "PN",
  Poland = "PL",
  Portugal = "PT",
  PuertoRico = "PR",
  Qatar = "QA",
  RepublicOfNorthMacedonia = "MK",
  Romania = "RO",
  RussianFederation = "RU",
  Rwanda = "RW",
  Reunion = "RE",
  SaintBarthelemy = "BL",
  SaintHelena = "SH",
  SaintKittsAndNevis = "KN",
  SaintLucia = "LC",
  SaintMartin = "MF",
  SaintPierreAndMiquelon = "PM",
  SaintVincentAndTheGrenadines = "VC",
  Samoa = "WS",
  SanMarino = "SM",
  SaoTomeAndPrincipe = "ST",
  SaudiArabia = "SA",
  Senegal = "SN",
  Serbia = "RS",
  Seychelles = "SC",
  SierraLeone = "SL",
  Singapore = "SG",
  SintMaarten = "SX",
  Slovakia = "SK",
  Slovenia = "SI",
  SolomonIslands = "SB",
  Somalia = "SO",
  SouthAfrica = "ZA",
  SouthGeorgiaAndTheSouthSandwichIslands = "GS",
  SouthSudan = "SS",
  Spain = "ES",
  SriLanka = "LK",
  Sudan = "SD",
  Suriname = "SR",
  SvalbardAndJanMayen = "SJ",
  Sweden = "SE",
  Switzerland = "CH",
  SyrianArabRepublic = "SY",
  Taiwan = "TW",
  Tajikistan = "TJ",
  Tanzania = "TZ",
  Thailand = "TH",
  TimorLeste = "TL",
  Togo = "TG",
  Tokelau = "TK",
  Tonga = "TO",
  TrinidadAndTobago = "TT",
  Tunisia = "TN",
  Turkey = "TR",
  Turkmenistan = "TM",
  TurksAndCaicosIslands = "TC",
  Tuvalu = "TV",
  Uganda = "UG",
  Ukraine = "UA",
  UnitedArabEmirates = "AE",
  UnitedKingdom = "GB",
  UnitedStatesMinorOutlyingIslands = "UM",
  UnitedStatesOfAmerica = "US",
  Uruguay = "UY",
  Uzbekistan = "UZ",
  Vanuatu = "VU",
  Venezuela = "VE",
  Vietnam = "VN",
  VirginIslandsBritish = "VG",
  VirginIslandsUS = "VI",
  WallisAndFutuna = "WF",
  WesternSahara = "EH",
  Yemen = "YE",
  Zambia = "ZM",
  Zimbabwe = "ZW",
  AlandIslands = "AX",
}

export interface CreateReceiver {
  type: ReceiverType;
  kyc_type: KYCType;
  email: string;
  tax_id: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state_province_region: string;
  country: CountryCode;
  postal_code: string;
  ip_address: string;
  image_url: string;
  phone_number: string;
  proof_of_address_doc_type: AddressDocType;
  proof_of_address_doc_file: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  id_doc_country: string;
  id_doc_type: IDDocType;
  id_doc_front_file: string;
  id_doc_back_file: string;
  legal_name: string;
  alternate_name: string;
  formation_date: string;
  website: string;
  owners: {
    first_name: string;
    last_name: string;
    role: string;
    date_of_birth: string;
    tax_id: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state_province_region: string;
    country: string;
    postal_code: string;
    id_doc_country: string;
    id_doc_type: IDDocType;
    id_doc_front_file: string;
    id_doc_back_file: string;
  }[];
  incorporation_doc_file: string;
  proof_of_ownership_doc_file: string;
  source_of_funds_doc_type: SourceOfFundsDocType;
  source_of_funds_doc_file: string;
  individual_holding_doc_front_file: string;
  purpose_of_transactions: PurposeOfTransactions;
  purpose_of_transactions_explanation: string;
  external_id: string;
}

export interface UpdateReceiver {
  email: string;
  tax_id: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state_province_region: string;
  country: CountryCode;
  postal_code: string;
  ip_address: string;
  image_url: string;
  phone_number: string;
  proof_of_address_doc_type: AddressDocType;
  proof_of_address_doc_file: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  id_doc_country: string;
  id_doc_type: IDDocType;
  id_doc_front_file: string;
  id_doc_back_file: string;
  legal_name: string;
  alternate_name: string;
  formation_date: string;
  website: string;
  owners: {
    id: string;
    first_name: string;
    last_name: string;
    role: string;
    date_of_birth: string;
    tax_id: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state_province_region: string;
    country: string;
    postal_code: string;
    id_doc_country: string;
    id_doc_type: IDDocType;
    id_doc_front_file: string;
    id_doc_back_file: string;
  }[];
  incorporation_doc_file: string;
  proof_of_ownership_doc_file: string;
  source_of_funds_doc_type: SourceOfFundsDocType;
  source_of_funds_doc_file: string;
  individual_holding_doc_front_file: string;
  purpose_of_transactions: PurposeOfTransactions;
  purpose_of_transactions_explanation: string;
  external_id: string;
}
