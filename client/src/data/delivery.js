// ═══════════════════════════════════════════
// DELIVERY DATA — ZR Express rates & offices
// ═══════════════════════════════════════════

export const DELIVERY_RATES = {
  1:  { home: 1050, desk: 750  }, 2:  { home: 550,  desk: 350  }, 3:  { home: 700,  desk: 500  },
  4:  { home: 600,  desk: 400  }, 5:  { home: 600,  desk: 400  }, 6:  { home: 550,  desk: 350  },
  7:  { home: 650,  desk: 450  }, 8:  { home: 950,  desk: 700  }, 9:  { home: 400,  desk: 250  },
  10: { home: 500,  desk: 350  }, 11: { home: 1200, desk: 900  }, 12: { home: 650,  desk: 450  },
  13: { home: 600,  desk: 400  }, 14: { home: 600,  desk: 400  }, 15: { home: 500,  desk: 350  },
  16: { home: 400,  desk: 200  }, 17: { home: 600,  desk: 400  }, 18: { home: 600,  desk: 400  },
  19: { home: 550,  desk: 350  }, 20: { home: 700,  desk: 500  }, 21: { home: 600,  desk: 400  },
  22: { home: 600,  desk: 400  }, 23: { home: 550,  desk: 350  }, 24: { home: 600,  desk: 400  },
  25: { home: 550,  desk: 350  }, 26: { home: 500,  desk: 350  }, 27: { home: 600,  desk: 400  },
  28: { home: 600,  desk: 400  }, 29: { home: 600,  desk: 400  }, 30: { home: 750,  desk: 550  },
  31: { home: 500,  desk: 300  }, 32: { home: 800,  desk: 600  }, 33: { home: 1200, desk: 900  },
  34: { home: 550,  desk: 350  }, 35: { home: 400,  desk: 250  }, 36: { home: 600,  desk: 400  },
  37: { home: 1200, desk: 900  }, 38: { home: 650,  desk: 450  }, 39: { home: 700,  desk: 500  },
  40: { home: 650,  desk: 450  }, 41: { home: 650,  desk: 450  }, 42: { home: 450,  desk: 300  },
  43: { home: 600,  desk: 400  }, 44: { home: 500,  desk: 350  }, 45: { home: 800,  desk: 600  },
  46: { home: 600,  desk: 400  }, 47: { home: 750,  desk: 550  }, 48: { home: 600,  desk: 400  },
  49: { home: 750,  desk: 550  }, 50: { home: 850,  desk: 650  }, 51: { home: 700,  desk: 500  },
  52: { home: 1400, desk: 1050 }, 53: { home: 1050, desk: 750  }, 54: { home: 1200, desk: 900  },
  55: { home: 1400, desk: 1050 }, 56: { home: 700,  desk: 500  }, 57: { home: 1200, desk: 900  },
  58: { home: 750,  desk: 550  }
}

export const WILAYAS = [
  { code: 1, name: "01 - Adrar" }, { code: 2, name: "02 - Chlef" }, { code: 3, name: "03 - Laghouat" },
  { code: 4, name: "04 - Oum El Bouaghi" }, { code: 5, name: "05 - Batna" }, { code: 6, name: "06 - Béjaïa" },
  { code: 7, name: "07 - Biskra" }, { code: 8, name: "08 - Béchar" }, { code: 9, name: "09 - Blida" },
  { code: 10, name: "10 - Bouira" }, { code: 11, name: "11 - Tamanrasset" }, { code: 12, name: "12 - Tébessa" },
  { code: 13, name: "13 - Tlemcen" }, { code: 14, name: "14 - Tiaret" }, { code: 15, name: "15 - Tizi Ouzou" },
  { code: 16, name: "16 - Alger" }, { code: 17, name: "17 - Djelfa" }, { code: 18, name: "18 - Jijel" },
  { code: 19, name: "19 - Sétif" }, { code: 20, name: "20 - Saïda" }, { code: 21, name: "21 - Skikda" },
  { code: 22, name: "22 - Sidi Bel Abbès" }, { code: 23, name: "23 - Annaba" }, { code: 24, name: "24 - Guelma" },
  { code: 25, name: "25 - Constantine" }, { code: 26, name: "26 - Médéa" }, { code: 27, name: "27 - Mostaganem" },
  { code: 28, name: "28 - M'Sila" }, { code: 29, name: "29 - Mascara" }, { code: 30, name: "30 - Ouargla" },
  { code: 31, name: "31 - Oran" }, { code: 32, name: "32 - El Bayadh" }, { code: 33, name: "33 - Illizi" },
  { code: 34, name: "34 - Bordj Bou Arréridj" }, { code: 35, name: "35 - Boumerdès" }, { code: 36, name: "36 - El Tarf" },
  { code: 37, name: "37 - Tindouf" }, { code: 38, name: "38 - Tissemsilt" }, { code: 39, name: "39 - El Oued" },
  { code: 40, name: "40 - Khenchela" }, { code: 41, name: "41 - Souk Ahras" }, { code: 42, name: "42 - Tipaza" },
  { code: 43, name: "43 - Mila" }, { code: 44, name: "44 - Aïn Defla" }, { code: 45, name: "45 - Naâma" },
  { code: 46, name: "46 - Aïn Témouchent" }, { code: 47, name: "47 - Ghardaïa" }, { code: 48, name: "48 - Relizane" },
  { code: 49, name: "49 - El M'Ghair" }, { code: 50, name: "50 - El Meniaa" }, { code: 51, name: "51 - Ouled Djellal" },
  { code: 52, name: "52 - Bordj Baji Mokhtar" }, { code: 53, name: "53 - Béni Abbès" }, { code: 54, name: "54 - In Salah" },
  { code: 55, name: "55 - In Guezzam" }, { code: 56, name: "56 - Touggourt" }, { code: 57, name: "57 - Djanet" },
  { code: 58, name: "58 - El M'Ghair" }
]

export const ZR_OFFICES = [
  { name: "مكتب دلس 35", wilaya: 35, address: "Dellys" },
  { name: "مكتب القبة 16", wilaya: 16, address: "Rue Chebihi Moussa" },
  { name: "مكتب المنيعة 58", wilaya: 58, address: "el menea" },
  { name: "Zouaghi 25", wilaya: 25, address: "L'Eucalyptus" },
  { name: "Hub Touggourt 55", wilaya: 55, address: "Touggourt" },
  { name: "مكتب بني عباس 52", wilaya: 52, address: "Beni Abbes" },
  { name: "مكتب أولاد جلال 51", wilaya: 51, address: "Elrahba" },
  { name: "مكتب غيليزان 48", wilaya: 48, address: "Cite 42 logements" },
  { name: "Hub Ghardaia 47", wilaya: 47, address: "Quartier Hadj Messaoud" },
  { name: "Hub Ain Temouchent 46", wilaya: 46, address: "Hai Zeitoun" },
  { name: "مكتب النعامة 45", wilaya: 45, address: "Cite 66 logements - Mecheria" },
  { name: "مكتب القليعة 42", wilaya: 42, address: "Route d'Alger cite cnep 140" },
  { name: "مكتب تيبازة 42", wilaya: 42, address: "Rabta" },
  { name: "Hub Souk Ahras 41", wilaya: 41, address: "RN 16 cooperatives el yassamine" },
  { name: "Hub Khenchela 40", wilaya: 40, address: "Park Omnisport" },
  { name: "مكتب الطارف 36", wilaya: 36, address: "El Tarf" },
  { name: "Hub Bordj menaiel 35", wilaya: 35, address: "Bordj Menael" },
  { name: "Hub Boumerdes 35", wilaya: 35, address: "Boulevard du ler Novembre" },
  { name: "Hub Bordj bouareridj 34", wilaya: 34, address: "Cite Chelbabi-Lagarre" },
  { name: "مكتب البيض 32", wilaya: 32, address: "Cite CNEP" },
  { name: "مكتب ما رافال 37", wilaya: 31, address: "Maraval" },
  { name: "Hub El Morchid 31", wilaya: 31, address: "Morchid" },
  { name: "Hub Canastel 37", wilaya: 31, address: "Canastel" },
  { name: "Hub Hassi Messaoud 30", wilaya: 30, address: "Cite 60 Logts" },
  { name: "مكتب معسكر 29", wilaya: 29, address: "Avenue Mehor Mehieddine" },
  { name: "Hub Bou Saada 28", wilaya: 28, address: "Meitar" },
  { name: "مكتب مسيلة 28", wilaya: 28, address: "Cite Ichbilia" },
  { name: "Hub Mostaganem 27", wilaya: 27, address: "Boulevard Moufti Benkara Mostafa" },
  { name: "مكتب المدية 26", wilaya: 26, address: "Rue Rouis Kadour (Beziwesh)" },
  { name: "مكتب المنظر الجميل 25", wilaya: 25, address: "Rue Barkat Lakhdar" },
  { name: "Hub NOUVELLE VILLE 25", wilaya: 25, address: "Cite Kadri Ibrahim" },
  { name: "مكتب قالمة 24", wilaya: 24, address: "Hassani Mohamed" },
  { name: "مكتب البوني 23", wilaya: 23, address: "Bungalows" },
  { name: "مكتب عنابة 23", wilaya: 23, address: "Rue De L'avant Port" },
  { name: "مكتب سكيكدة 21", wilaya: 21, address: "Mokhbi Leulmi" },
  { name: "مكتب سعيدة 20", wilaya: 20, address: "Cite 5 Juillet" },
  { name: "مكتب سطيف 19", wilaya: 19, address: "Cite Dallas 3eme Tranche" },
  { name: "مكتب الطاهير 18", wilaya: 18, address: "Boukaabour" },
  { name: "مكتب جيجل 18", wilaya: 18, address: "Freres Kamel" },
  { name: "مكتب الجلفة 17", wilaya: 17, address: "Cite Berrbih" },
  { name: "Reghaia 16", wilaya: 16, address: "Cite Amirouche 692" },
  { name: "Hub Ouled fayet 16", wilaya: 16, address: "CC2" },
  { name: "مكتب بئر خادم 16", wilaya: 16, address: "Que de Constantine" },
  { name: "مكتب براقي 16", wilaya: 16, address: "Route de l'arbaa" },
  { name: "مكتب بئرتوتة 16", wilaya: 16, address: "Bouhadja Ali" },
  { name: "مكتب تيارت 14", wilaya: 14, address: "route de l'academie" },
  { name: "مكتب تلمسان 13", wilaya: 13, address: "Cite el Imama" },
  { name: "مكتب تبسة 12", wilaya: 12, address: "Larbi Tebessi" },
  { name: "Hub Tamanrasset 11", wilaya: 11, address: "Cite El wiam" },
  { name: "Hub Mouzaia 09", wilaya: 9, address: "Ben Ahmed Ali Aslaoui" },
  { name: "مكتب بوقرة 10", wilaya: 9, address: "Hamidouch Mouloud, route d'alger" },
  { name: "مكتب البليدة 09", wilaya: 9, address: "Cite Ramoule" },
  { name: "مكتب بسكرة 30", wilaya: 7, address: "Cite El-Kors" },
  { name: "مكتب أ (أكبو) 06", wilaya: 6, address: "Gare ferroviaire Akbou" },
  { name: "مكتب بجاية 06", wilaya: 6, address: "Cite Somacob" },
  { name: "مكتب باتنة 05", wilaya: 5, address: "Hay El Riadh" },
  { name: "Hub Ain El Beida 04", wilaya: 4, address: "cite el Amal" },
  { name: "مكتب تنس 02", wilaya: 2, address: "Rue Boufadis" },
  { name: "مكتب أدرار 01", wilaya: 1, address: "Cite 140 Logements" }
]

export function getShippingCost(wilayaCode, deliveryType) {
  const code = parseInt(wilayaCode) || 0
  const rates = DELIVERY_RATES[code]
  if (!rates) return 600
  return deliveryType === 'office' ? rates.desk : rates.home
}

export function getOfficesForWilaya(wilayaCode) {
  const code = parseInt(wilayaCode) || 0
  return ZR_OFFICES.filter(o => o.wilaya === code)
}
