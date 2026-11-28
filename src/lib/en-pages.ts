/**
 * English pages (28/11/2026). Informational pages for foreign companies and
 * Brazilians abroad. The lawyer is admitted in Brazil only (OAB/SP); the pages
 * never offer advice on foreign law. Each page pairs with a Portuguese page in
 * src/lib/hreflang.ts.
 */
export interface EnSection { h2: string; paras: string[]; list?: string[] }
export interface EnPage {
  slug: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  sections: EnSection[];
  faq: { q: string; a: string }[];
  ptHref: string;
  ptLabel: string;
}

export const enPages: EnPage[] = [
  {
    slug: 'customs-seizure-brazil',
    title: 'Customs Seizure and Detained Goods in Brazil',
    description: 'Goods held by Brazilian Customs (Receita Federal)? How detention, red channel inspections and forfeiture work, deadlines, and how imports are released.',
    h1: 'Customs seizure and detained imports in Brazil',
    lead: 'When Brazilian Customs (Receita Federal) holds an import, storage and container costs keep running while deadlines to respond are short. This page explains how the process works and what can be done.',
    sections: [
      {
        h2: 'Why goods are held',
        paras: [
          'Every import declaration is assigned an inspection channel. Green clears automatically; yellow requires document review; red requires physical inspection; grey triggers a special valuation and fraud procedure. During inspection, Customs may issue requirements (exigências) that must be answered through the Single Window (Portal Único Siscomex).',
          'Common triggers are suspected undervaluation, wrong tariff classification (NCM), doubts about the real buyer behind the operation (fraudulent interposition), missing licences from agencies such as ANVISA or MAPA, and inconsistencies between the invoice, packing list and bill of lading.',
        ],
      },
      {
        h2: 'Forfeiture (pena de perdimento)',
        paras: [
          'In serious cases, Customs issues a notice that may lead to forfeiture of the goods. The importer has 20 days from notice to file an administrative challenge (Decree-Law 1,455/1976, art. 27-A, added by Law 14,651/2023). If the goods cannot be located, forfeiture may be converted into a fine equal to their customs value.',
        ],
      },
      {
        h2: 'How goods are released',
        paras: ['Depending on the case, release can come from meeting the requirements, from an administrative defence, from release against a guarantee while the dispute continues, or from a writ of mandamus (mandado de segurança) in federal court when the detention is unlawful or unreasonably long.'],
        list: [
          'Read the exact requirement or notice in the Single Window and note the deadline.',
          'Ask the terminal for the storage statement and the carrier for the demurrage terms.',
          'Consider unstuffing the container to stop demurrage while the goods remain held.',
          'Keep the commercial invoice, proof of payment, contract and correspondence with the supplier.',
        ],
      },
    ],
    faq: [
      { q: 'Can a foreign exporter act directly?', a: 'The customs procedure is conducted by the Brazilian importer of record. A foreign exporter can support the defence with documents and, when the importer is a related company, coordinate the strategy with Brazilian counsel.' },
      { q: 'How long does a red channel inspection take?', a: 'There is no single fixed deadline for completing an inspection; delays beyond what is reasonable can be challenged. Container and storage costs are a key factor in deciding how fast to act.' },
    ],
    ptHref: '/areas-de-atuacao/direito-aduaneiro-tributario/retencao-de-mercadorias/',
    ptLabel: 'Retenção de mercadorias (em português)',
  },
  {
    slug: 'container-demurrage-brazil',
    title: 'Container Demurrage and Detention Disputes in Brazil',
    description: 'Disputing container demurrage or detention charges in Brazil: free time, progressive daily rates, depot refusals, customs holds and court collection actions.',
    h1: 'Container demurrage and detention disputes in Brazil',
    lead: 'Demurrage is often the cost that grows fastest when cargo is delayed at a Brazilian port. Before paying or signing a settlement, every day charged should be checked against the contract.',
    sections: [
      {
        h2: 'How charges are calculated',
        paras: [
          'Carriers and NVOCCs charge daily rates for container use beyond the free time, according to their tariff and the container responsibility term signed by the importer. Rates are usually progressive by bands of days and quoted in US dollars, converted at the exchange rate defined in the contract.',
          'Our free calculator rebuilds the charge with free time, progressive bands and the Central Bank PTAX rate.',
        ],
      },
      {
        h2: 'Frequent errors',
        paras: ['Wrong start date, free time shorter than negotiated, outdated tariff, wrong exchange-rate date, days when the depot could not receive empty containers, and delays caused by the terminal or the carrier itself.'],
      },
      {
        h2: 'Regulation and courts',
        paras: ['Brazil’s waterway transport agency, ANTAQ, regulates the rights and duties of users and maritime carriers (ANTAQ Resolution 62/2021) and receives complaints. Collection of demurrage is a civil claim in state courts, subject to a limitation period on which the Superior Court of Justice (STJ) has ruled.'],
      },
    ],
    faq: [
      { q: 'Who pays demurrage while Customs holds the cargo?', a: 'As a rule, the contract places container use beyond the free time on the consignee, including during customs inspection. The analysis changes when the delay was caused by the carrier, terminal or depot.' },
      { q: 'Can a foreign shipper be involved?', a: 'Depending on the Incoterm and the bill of lading, the shipper may be named in the claim. Each case depends on the contract chain.' },
    ],
    ptHref: '/areas-de-atuacao/direito-maritimo-portuario/demurrage-e-detention-de-conteiner/',
    ptLabel: 'Demurrage e detention (em português)',
  },
  {
    slug: 'brazilian-maritime-and-port-law',
    title: 'Brazilian Maritime, Port and Transport Law',
    description: 'Cargo damage and loss, container demurrage, terminal and storage charges, release of cargo and transport contracts in Brazil, for importers and logistics companies.',
    h1: 'Brazilian maritime, port and transport law',
    lead: 'Legal support in Brazil for importers, exporters and logistics companies in disputes with carriers, NVOCCs, freight forwarders, port terminals and trucking companies.',
    sections: [
      {
        h2: 'Typical matters',
        paras: [],
        list: [
          'Container demurrage and detention charges',
          'Cargo damage, shortage and loss claims, including insurers’ subrogation claims',
          'Release of cargo or bills of lading held over disputed charges',
          'Terminal storage, THC and other port charges; complaints to ANTAQ',
          'Road transport of cargo: contracts, minimum freight rates and toll vouchers (ANTT)',
        ],
      },
      {
        h2: 'Key rules',
        paras: [
          'The Brazilian Civil Code governs contracts of carriage: the carrier is liable for the cargo from receipt to delivery (arts. 749 and 750), and non-apparent damage must be notified within 10 days of delivery (art. 754, sole paragraph). An insurer that pays the claim is subrogated to the insured’s rights against the party responsible (Federal Supreme Court, Precedent 188).',
          'Ports are organised under the Ports Law (Law 12,815/2013) and regulated, together with waterway transport, by ANTAQ (Law 10,233/2001). Road cargo transport is governed by Law 11,442/2007 and regulated by ANTT.',
        ],
      },
    ],
    faq: [
      { q: 'Do you advise on foreign law?', a: 'No. The firm advises on Brazilian law only. When a bill of lading chooses foreign law or courts, we work with foreign counsel on the Brazilian side of the matter.' },
    ],
    ptHref: '/areas-de-atuacao/direito-maritimo-portuario/',
    ptLabel: 'Direito marítimo, portuário e transportes (em português)',
  },
  {
    slug: 'recognition-of-foreign-judgments-brazil',
    title: 'Recognition of Foreign Judgments in Brazil (STJ)',
    description: 'How to enforce a foreign judgment, divorce or arbitral award in Brazil: recognition by the Superior Court of Justice (STJ), documents, apostille and translation.',
    h1: 'Recognition of foreign judgments and divorces in Brazil',
    lead: 'A judgment, divorce decree or arbitral award issued abroad generally needs to be recognised in Brazil before it produces effects here. Recognition is granted by the Superior Court of Justice (STJ) in Brasília.',
    sections: [
      {
        h2: 'When recognition is required',
        paras: [
          'Foreign judgments must be recognised by the STJ to be enforced in Brazil (Federal Constitution, art. 105, I, i; Code of Civil Procedure, arts. 960 to 965). This covers commercial judgments, custody and support decisions, and foreign arbitral awards.',
          'A purely consensual foreign divorce (with no decision on custody, support or division of assets) can be registered directly with the Brazilian civil registry, without going to the STJ (CPC, art. 961, § 5).',
        ],
      },
      {
        h2: 'What the STJ checks',
        paras: ['The STJ does not retry the case. It checks that the decision was issued by a competent authority, that the defendant was properly served or appeared, that the decision is final and effective in the country of origin, and that it does not offend Brazilian public policy.'],
        list: [
          'Full copy of the decision, with proof that it is final',
          'Apostille (Hague Convention, in force for Brazil since 2016) or consular legalisation',
          'Sworn translation into Portuguese by a Brazilian sworn translator',
          'Power of attorney to a lawyer admitted in Brazil',
        ],
      },
    ],
    faq: [
      { q: 'Do I need to travel to Brazil?', a: 'No. The procedure is handled by a Brazilian lawyer, and documents can be signed and apostilled abroad.' },
      { q: 'After recognition, how is the judgment enforced?', a: 'A recognised judgment is enforced before the competent federal court in Brazil, like a domestic judgment, including attachment of assets.' },
    ],
    ptHref: '/areas-de-atuacao/homologacao-de-sentenca-estrangeira/',
    ptLabel: 'Homologação de sentença estrangeira (em português)',
  },
  {
    slug: 'probate-in-brazil-heirs-abroad',
    title: 'Probate in Brazil for Heirs Living Abroad',
    description: 'Inheriting assets in Brazil while living abroad: probate in court or at a notary, powers of attorney, apostille, ITCMD inheritance tax and transferring funds.',
    h1: 'Probate in Brazil for heirs living abroad',
    lead: 'Assets located in Brazil are inherited under a Brazilian probate procedure (inventário), even when the deceased or the heirs lived abroad. Heirs do not need to travel: the process can be handled through a power of attorney.',
    sections: [
      {
        h2: 'Court or notary',
        paras: [
          'Only Brazilian authorities can conduct probate of assets located in Brazil (Code of Civil Procedure, art. 23, II). When all heirs agree and are of age, probate can be done by public deed at a notary’s office, which is usually faster (CPC, art. 610). Since CNJ Resolution 571/2024, the notarial route may also be available when there is a minor heir or a will, under specific conditions.',
        ],
      },
      {
        h2: 'Documents from abroad',
        paras: ['Heirs abroad sign a power of attorney at a Brazilian consulate or before a local notary with an apostille. Foreign documents (death, marriage and birth certificates) need an apostille and a sworn translation.'],
      },
      {
        h2: 'Inheritance tax and deadlines',
        paras: ['Brazilian states charge inheritance tax (ITCMD). In São Paulo, it is governed by State Law 10,705/2000, and late opening of probate leads to penalties. Federal Constitutional Amendment 132/2023 changed the rules on which state taxes inheritances involving assets or deceased persons abroad.'],
      },
    ],
    faq: [
      { q: 'Can money from a Brazilian bank account be sent abroad after probate?', a: 'Yes. Once the assets are transferred to the heirs, funds can be remitted abroad through the banking system, subject to tax and foreign-exchange rules.' },
    ],
    ptHref: '/areas-de-atuacao/inventario-com-herdeiro-no-exterior/',
    ptLabel: 'Inventário com herdeiro no exterior (em português)',
  },
];
