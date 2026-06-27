/* ════════════════════════════════════════════
   aizo.dz — i18n.js
   Multi-Language System & ZR Express Delivery Rates
   ════════════════════════════════════════════ */

// ═══════════════════════════════════════════
// ZR Express Delivery Rates (A DOMICILE / STOP DESK)
// RETOUR rates are NOT included (as per requirements)
// ═══════════════════════════════════════════
const DELIVERY_RATES = {
  1:  { home: 1050, desk: 750  }, // Adrar
  2:  { home: 550,  desk: 350  }, // Chlef
  3:  { home: 700,  desk: 500  }, // Laghouat
  4:  { home: 600,  desk: 400  }, // Oum El Bouaghi
  5:  { home: 600,  desk: 400  }, // Batna
  6:  { home: 550,  desk: 350  }, // Béjaïa
  7:  { home: 650,  desk: 450  }, // Biskra
  8:  { home: 950,  desk: 700  }, // Béchar
  9:  { home: 400,  desk: 250  }, // Blida
  10: { home: 500,  desk: 350  }, // Bouira
  11: { home: 1200, desk: 900  }, // Tamanrasset
  12: { home: 650,  desk: 450  }, // Tébessa
  13: { home: 600,  desk: 400  }, // Tlemcen
  14: { home: 600,  desk: 400  }, // Tiaret
  15: { home: 500,  desk: 350  }, // Tizi Ouzou
  16: { home: 400,  desk: 200  }, // Algiers
  17: { home: 600,  desk: 400  }, // Djelfa
  18: { home: 600,  desk: 400  }, // Jijel
  19: { home: 550,  desk: 350  }, // Sétif
  20: { home: 700,  desk: 500  }, // Saïda
  21: { home: 600,  desk: 400  }, // Skikda
  22: { home: 600,  desk: 400  }, // Sidi Bel Abbès
  23: { home: 550,  desk: 350  }, // Annaba
  24: { home: 600,  desk: 400  }, // Guelma
  25: { home: 550,  desk: 350  }, // Constantine
  26: { home: 500,  desk: 350  }, // Médéa
  27: { home: 600,  desk: 400  }, // Mostaganem
  28: { home: 600,  desk: 400  }, // M'Sila
  29: { home: 600,  desk: 400  }, // Mascara
  30: { home: 750,  desk: 550  }, // Ouargla
  31: { home: 500,  desk: 300  }, // Oran
  32: { home: 800,  desk: 600  }, // El Bayadh
  33: { home: 1200, desk: 900  }, // Illizi
  34: { home: 550,  desk: 350  }, // Bordj Bou Arréridj
  35: { home: 400,  desk: 250  }, // Boumerdès
  36: { home: 600,  desk: 400  }, // El Tarf
  37: { home: 1200, desk: 900  }, // Tindouf
  38: { home: 650,  desk: 450  }, // Tissemsilt
  39: { home: 700,  desk: 500  }, // El Oued
  40: { home: 650,  desk: 450  }, // Khenchela
  41: { home: 650,  desk: 450  }, // Souk Ahras
  42: { home: 450,  desk: 300  }, // Tipaza
  43: { home: 600,  desk: 400  }, // Mila
  44: { home: 500,  desk: 350  }, // Aïn Defla
  45: { home: 800,  desk: 600  }, // Naâma
  46: { home: 600,  desk: 400  }, // Aïn Témouchent
  47: { home: 750,  desk: 550  }, // Ghardaïa
  48: { home: 600,  desk: 400  }, // Relizane
  49: { home: 750,  desk: 550  }, // El M'Ghair
  50: { home: 850,  desk: 650  }, // El Meniaa
  51: { home: 700,  desk: 500  }, // Ouled Djellal
  52: { home: 1400, desk: 1050 }, // Bordj Baji Mokhtar
  53: { home: 1050, desk: 750  }, // Béni Abbès
  54: { home: 1200, desk: 900  }, // In Salah
  55: { home: 1400, desk: 1050 }, // In Guezzam
  56: { home: 700,  desk: 500  }, // Touggourt
  57: { home: 1200, desk: 900  }, // Djanet
  58: { home: 750,  desk: 550  }, // El M'Ghair
};

window.DELIVERY_RATES = DELIVERY_RATES;

/**
 * Get shipping cost for a wilaya and delivery type
 * @param {number|string} wilayaCode - Wilaya number (1-58)
 * @param {string} deliveryType - 'home' or 'office'
 * @returns {number} Shipping cost in DZD
 */
window.getShippingCost = function(wilayaCode, deliveryType) {
  const code = parseInt(wilayaCode) || 0;
  const rates = DELIVERY_RATES[code];
  if (!rates) return 600; // default fallback
  return deliveryType === 'office' ? rates.desk : rates.home;
};

/**
 * Update the delivery price display next to each delivery option
 */
window.updateDeliveryPriceDisplay = function() {
  const wilayaEl = document.getElementById('checkout-wilaya');
  const homePriceEl = document.getElementById('home-delivery-price');
  const officePriceEl = document.getElementById('office-delivery-price');
  if (!wilayaEl) return;

  const wilayaCode = parseInt(wilayaEl.value) || 0;
  if (wilayaCode === 0) {
    if (homePriceEl) homePriceEl.textContent = '';
    if (officePriceEl) officePriceEl.textContent = '';
    return;
  }

  const homePrice = window.getShippingCost(wilayaCode, 'home');
  const officePrice = window.getShippingCost(wilayaCode, 'office');
  if (homePriceEl) homePriceEl.textContent = homePrice.toLocaleString() + ' DZD';
  if (officePriceEl) officePriceEl.textContent = officePrice.toLocaleString() + ' DZD';
};

// ═══════════════════════════════════════════
// TRANSLATIONS (AR / FR / EN)
// ═══════════════════════════════════════════
const TRANSLATIONS = {
  fr: {
    announcement: "LIVRAISON RAPIDE DANS TOUTES LES WILAYAS & PAIEMENT À LA LIVRAISON",
    nav_new_arrivals: "Nouveautés", nav_collection: "La Collection", nav_about: "À Propos",
    nav_dashboard: "Tableau de Bord", nav_shop_now: "Acheter",
    nav_best_sellers: "Meilleures Ventes",
    nav_shop: "Boutique",
    nav_shop_all: "Tout",
    nav_shop_denim: "Denim",
    nav_shop_jackets: "Vestes",
    nav_shop_hoodies: "Sweats",
    nav_about_brand: "À Propos d'AIZO.DZ",
    nav_faq: "FAQs",
    nav_shipping: "Livraison & Expédition",
    nav_contact: "Contact",
    country_modal_title: "Choisir le pays / la devise",
    search_placeholder: "Tapez pour rechercher...",
    hero_shop_now: "ACHETER MAINTENANT",
    cat_shop_by: "Acheter par Catégorie", cat_all: "Tout", cat_jeans: "Jeans",
    cat_jackets: "Vestes", cat_hoodies: "Sweats",
    cat_shop_denim: "Shop Denim", cat_shop_jackets: "Shop Vestes", cat_shop_hoodies: "Shop Sweats",
    col_eyebrow: "Nouveautés", col_title: "La Collection", col_view_all: "Voir Tout →",
    col_load_more: "Charger Plus", col_add_to_cart: "Ajouter au Panier",
    about_eyebrow: "Qui nous sommes",
    about_title: "Des objets qui comptent.<br/><em>Des moments qui durent.</em>",
    about_body: "aizo.dz est né d'une conviction que les objets du quotidien doivent être beaux, fonctionnels et intentionnels. Nous recherchons et sélectionnons les plus belles pièces — chacune choisie pour élever l'ordinaire en extraordinaire.",
    nl_eyebrow: "Restez informé",
    nl_title: "Rejoignez le<br/><em>cercle intime.</em>",
    nl_body: "Soyez le premier informé des nouveautés, offres exclusives et histoires derrière chaque pièce.",
    nl_placeholder: "Votre adresse e-mail", nl_subscribe: "S'abonner",
    nl_success: "✓ Merci — vous êtes inscrit.",
    feat_delivery: "Livraison Rapide",
    feat_delivery_desc: "Livraison rapide et sécurisée à travers toutes les wilayas d'Algérie.",
    feat_auth: "Garantie d'Authenticité",
    feat_auth_desc: "Chaque produit est vérifié manuellement avant de vous parvenir.",
    feat_returns: "Retours Faciles",
    feat_returns_desc: "Retours sans tracas sous 14 jours. Sans questions.",
    foot_tagline: "Des essentiels sélectionnés pour une vie plus intentionnelle.<br/>Fièrement Algérien.",
    foot_shop: "Boutique", foot_new_arrivals: "Nouveautés", foot_best_sellers: "Meilleures Ventes",
    foot_home_living: "Maison & Vie", foot_accessories: "Accessoires", foot_gift_sets: "Coffrets Cadeaux",
    foot_info: "Info", foot_our_story: "Notre Histoire", foot_shipping: "Livraison & Retours",
    foot_privacy: "Confidentialité", foot_terms: "Conditions", foot_faq: "FAQ",
    foot_contact: "Contact",
    foot_copy: "© 2026 AIZO.DZ — Tous droits réservés.", foot_made: "Fait avec intention · Algérie",
    cart_title_ar: "Panier", cart_title_en: "/ Cart",
    cart_empty_ar: "Le panier est vide", cart_empty_en: "Votre panier est vide",
    cart_shop_now: "Acheter Maintenant",
    cart_subtotal: "Sous-total", cart_shipping_label: "Livraison", cart_total: "Total",
    cart_free: "Gratuite",
    checkout_title_ar: "Informations de Livraison", checkout_title_en: "/ Delivery Info",
    checkout_name_label: "Prénom *", checkout_name_ph: "Votre prénom",
    checkout_surname_label: "Nom *", checkout_surname_ph: "Votre nom",
    checkout_phone_label: "Numéro de Téléphone *", checkout_phone_ph: "05 / 06 / 07 XX XX XX XX",
    checkout_wilaya_label: "Wilaya *", checkout_wilaya_ph: "Choisir la wilaya...",
    checkout_delivery_type: "Type de Livraison *",
    delivery_home: "Livraison à Domicile (A DOMICILE)",
    delivery_home_desc: "Paiement à la livraison",
    delivery_office: "Livraison au Bureau (STOP DESK)",
    delivery_office_desc: "Récupération au bureau de livraison",
    checkout_address_label: "Adresse Détaillée *",
    checkout_address_ph: "Ex: Cité la paix, rue de l'émir, n°12, 2ème étage",
    checkout_office_label: "Bureau de Livraison *", checkout_office_ph: "Choisir le bureau...",
    checkout_confirm: "Confirmer la Commande", checkout_sending: "Envoi en cours...",
    err_name: "Veuillez saisir votre prénom",
    err_surname: "Veuillez saisir votre nom",
    err_phone: "Numéro de téléphone invalide (10 chiffres)",
    err_wilaya: "Veuillez choisir la wilaya", err_address: "Veuillez saisir l'adresse",
    err_office: "Veuillez choisir le bureau",
    success_title: "Votre commande a été enregistrée !",
    success_subtitle: "Merci pour votre confiance. Nous vous contacterons bientôt pour confirmer la commande.",
    success_order_label: "N° de commande :", success_name_label: "Nom :",
    success_phone_label: "Téléphone :", success_wilaya_label: "Wilaya :",
    success_delivery_label: "Livraison à :", success_total_label: "Total :",
    success_continue: "Continuer les Achats",
    lead_title: "Rejoignez-nous", lead_desc_ar: "Inscrivez-vous à notre newsletter pour les mises à jour et collections exclusives.",
    lead_desc_en: "Abonnez-vous pour recevoir nos nouveautés.",
    lead_placeholder: "Votre e-mail", lead_subscribe: "S'inscrire",
    lead_success_title: "Merci !", lead_success_desc: "Votre e-mail a été enregistré.",
    marquee_1: "Qualité Premium", marquee_2: "Livraison Rapide 58 Wilayas",
    marquee_3: "Sélectionné en Algérie", marquee_4: "Mode Consciente",
    marquee_5: "Retours sous 14 Jours", marquee_6: "Authenticité Garantie",
    coll_hero_title: "La Collection", coll_hero_desc: "Des essentiels minimalistes conçus avec précision et intention.",
    coll_search_label: "Rechercher", coll_search_ph: "Tapez pour rechercher...",
    coll_categories: "Catégories", coll_all: "Tous les Produits", coll_denim: "Denim / Jeans",
    coll_jackets: "Vestes", coll_hoodies: "Sweats", coll_sort: "Trier Par",
    coll_featured: "En vedette", coll_price_asc: "Prix: Croissant", coll_price_desc: "Prix: Décroissant",
    coll_name_asc: "A-Z", coll_name_desc: "Z-A",
    coll_showing: "Affichage de", coll_products: "produits", coll_curated: "Streetwear Sélectionné",
    pick_color: "Choisir la Couleur / Select Color", pick_size: "Choisir la Taille / Select Size",
    no_offices: "Aucun bureau disponible dans cette wilaya", choose_office_first: "Veuillez d'abord choisir la wilaya...",
    pd_color: "Couleur",
    pd_size: "Taille",
    pd_custom_order: "Commande Personnalisée",
    pd_feat_shipping: "Livraison rapide 58 wilayas",
    pd_feat_quality: "Qualité premium garantie",
    pd_feat_returns: "Échange ou retour sous 14 jours",
    co_title: "🎨 Personnalisation Premium",
    co_step_design: "Design",
    co_step_options: "Options",
    co_step_info: "Infos Client",
    co_step_summary: "Résumé",
    co_area_center: "Centre poitrine",
    co_area_chest_left: "Poitrine Gauche",
    co_area_chest_right: "Poitrine Droite",
    co_area_back: "Dos",
    co_area_sleeve_right: "Manche Droite",
    co_area_sleeve_left: "Manche Gauche",
    co_upload: "Uploader",
    co_delete: "Supprimer",
    co_garment_color: "Couleur du vêtement",
    co_size: "Taille",
    co_service_type: "Type de Service",
    co_embroidery: "Broderie",
    co_print: "Impression",
    co_active: "Actif",
    co_coming_soon: "Bientôt",
    co_name: "Prénom *",
    co_surname: "Nom *",
    co_email: "Email *",
    co_phone: "Téléphone *",
    co_province: "Wilaya *",
    co_notes: "Notes spéciales (Ex: dimensions, remarques)",
    co_order_summary: "Récapitulatif de la commande",
    co_product: "Produit",
    co_placements: "Placements",
    co_customer: "Client",
    co_prev: "← Précédent",
    co_next: "Suivant →",
    co_confirm: "✓ Confirmer la commande",
    co_success_title: "Commande envoyée avec succès !",
    co_success_desc: "Nous avons bien reçu votre commande personnalisée. Notre équipe vous contactera bientôt.",
    co_success_close: "Fermer",
    co_garment_type: "Type de vêtement",
    co_upload_title: "Télécharger vos designs (PNG transparent)",
    co_drag_drop: "Glissez-déposez vos logos ici",
    co_click_browse: "Ou cliquez pour parcourir les fichiers",
    co_active_designs: "Mes Designs Actifs",
    co_delivery_info_title: "Informations de livraison",
    co_delivery_info_desc: "Veuillez renseigner vos coordonnées pour enregistrer votre commande personnalisée.",
    co_name_ph: "Votre prénom",
    co_surname_ph: "Votre nom",
    co_email_ph: "Ex: email@exemple.com",
    co_phone_ph: "05 / 06 / 07 XX XX XX XX",
    co_notes_ph: "Instructions spéciales... Ex: broderie en fils dorés, dimensions précises du logo...",
    co_num_designs: "Nombre de designs",
    co_summary_desc: "Veuillez vérifier les informations ci-dessous avant de soumettre définitivement votre commande.",
    reviews: "avis",

    // Admin Dashboard
    admin_login_title: "Connexion Administrateur",
    admin_login_desc: "Veuillez saisir le mot de passe pour accéder au panneau d'administration.",
    admin_login_pwd_ph: "Mot de passe",
    admin_login_btn: "Se connecter",
    admin_back_store: "← Retour à la boutique",
    admin_sidebar_role: "Gestionnaire de boutique",
    admin_logout: "Se déconnecter",
    admin_title_panel_stats: "Statistiques Générales",
    admin_title_panel_orders: "Gestion des commandes",
    admin_title_panel_leads: "Liste des e-mails",
    admin_title_panel_add_product: "Ajouter un produit",
    admin_title_panel_products: "Liste des produits",
    admin_title_panel_custom_orders: "Commandes Spéciales / Personnalisées",
    admin_custom_orders_desc: "Toutes les commandes contenant des designs personnalisés de clients.",
    admin_custom_orders_total_label: "Total Commandes Spéciales",
    admin_custom_orders_pending_label: "Commandes en attente",
    admin_custom_orders_empty: "Aucune commande personnalisée correspondante.",
    admin_nav_stats: "✦ Statistiques",
    admin_nav_orders: "📦 Commandes",
    admin_nav_custom_orders: "🎨 Commandes Spéciales",
    admin_nav_leads: "📧 Liste e-mails",
    admin_nav_add_product: "✨ Ajouter produit",
    admin_nav_products: "🛍️ Liste produits",
    admin_profile_status: "Admin en ligne",
    admin_server_disconnected: "Serveur hors ligne",
    admin_sales_total: "Ventes confirmées",
    admin_sales_sub: "Commandes confirmées uniquement",
    admin_orders_total: "Nombre total de commandes",
    admin_orders_pending: "commande(s) en attente",
    admin_products_active: "Produits actifs",
    admin_products_sub: "Affichés dans la boutique",
    admin_leads_total: "Total Abonnés (Leads)",
    admin_leads_sub: "E-mails enregistrés",
    admin_returned_total: "Commandes retournées",
    admin_returned_sub: "Retournées par ZR Express",
    admin_delivered_total: "Commandes livrées",
    admin_delivered_sub: "Livrées aux clients",
    admin_recent_orders: "Dernières commandes reçues",
    admin_login_error: "Le mot de passe est incorrect !",
    admin_back_store_sidebar: "← Retour à la boutique",
    admin_form_add_title: "Ajouter un nouveau produit",
    admin_form_add_desc: "Remplissez les détails ci-dessous pour afficher le produit directement sur la page d'accueil de la boutique.",
    admin_form_edit_title: "Modifier le produit : ",
    admin_form_prod_name: "Nom du produit *",
    admin_form_prod_name_ph: "Ex: Vescartes Ronin Jacket",
    admin_form_prod_sub: "Description courte (Collection/Sous-titre) *",
    admin_form_prod_sub_ph: "Ex: Edo collection ou Vescartes",
    admin_form_prod_price: "Prix (DZD) *",
    admin_form_prod_price_ph: "Ex: 12500",
    admin_form_prod_badge: "Badge du produit (Optionnel)",
    admin_form_badge_none: "Aucun badge",
    admin_form_prod_stars: "Évaluation par défaut (Étoiles) *",
    admin_form_prod_reviews: "Nombre d'avis par défaut *",
    admin_form_prod_stock: "Quantité en stock *",
    admin_form_prod_img: "Lien de l'image du produit (URL) *",
    admin_form_prod_img_ph: "Entrez un lien d'image direct (Pinterest, Imgur, etc.)",
    admin_form_prod_img_help: "Vous pouvez copier le lien de n'importe quelle image de vêtement sur internet pour l'utiliser.",
    admin_form_prod_colors_chk: "Le produit a-t-il des options de couleur ?",
    admin_form_prod_colors: "Couleurs disponibles (séparées par des virgules) *",
    admin_form_prod_colors_ph: "Ex: Noir, Blanc, Bleu",
    admin_form_prod_colors_help: "Entrez les couleurs du produit séparées par des virgules. Elles seront utilisées dans les options d'ajout au panier.",
    admin_form_prod_sizes: "Tailles disponibles (choisissez-en une ou plusieurs) *",
    admin_form_prod_sizes_help: "Si aucune taille n'est sélectionnée, la taille M sera utilisée par défaut.",
    admin_form_btn_save: "Enregistrer et ajouter le produit",
    admin_form_btn_update: "Mettre à jour le produit",
    admin_form_btn_reset: "Réinitialiser",
    admin_toast_add_success: "✓ Produit ajouté avec succès !",
    admin_toast_edit_success: "✓ Produit modifié avec succès !",
    admin_toast_zr_success: " — Produit publié sur ZR Express",
    admin_products_title: "Produits affichés dans la boutique",
    admin_products_desc: "Vous pouvez consulter tous les produits (par défaut et ajoutés manuellement). Vous pouvez également supprimer les produits ajoutés manuellement.",
    admin_leads_title: "Liste des abonnés / Email Leads",
    admin_leads_desc: "Tous les e-mails enregistrés via le formulaire d'inscription de la boutique.",
    admin_leads_total_label: "Total des abonnés",
    admin_leads_latest_label: "Dernière inscription",
    admin_col_actions_edit: "Modifier",
    admin_col_actions_delete: "Supprimer",
    admin_products_empty: "Aucun produit chargé.",
    admin_leads_empty: "Aucun abonné pour le moment.",
    admin_pagination_prev: "Précédent",
    admin_pagination_next: "Suivant",
    admin_pagination_page: "Page",
    admin_pagination_of: "sur",
    admin_orders_empty: "Aucune commande correspondante.",
    admin_orders_recent_empty: "Aucune commande enregistrée.",
    admin_spec_color: "Couleur :",
    admin_spec_size: "Taille :",
    admin_spec_qty: "Qté :",
    admin_order_spec_title: "Détails de la commande personnalisée",
    admin_order_spec_color: "Couleur :",
    admin_order_spec_size: "Taille :",
    admin_order_spec_service: "Service :",
    admin_order_spec_client: "Client :",
    admin_order_spec_email: "E-mail :",
    admin_order_spec_phone: "Téléphone :",
    admin_order_spec_province: "Wilaya :",
    admin_order_spec_notes: "Notes :",
    admin_order_spec_no_notes: "Aucune note",
    admin_order_spec_final_mockup: "Aperçu du modèle final",
    admin_order_spec_files: "Fichiers joints",
    admin_order_spec_download: "Télécharger le design original",
    admin_order_spec_no_files: "Aucun design joint",
    admin_status_updated: "✓ Statut de la commande mis à jour !",
    admin_order_deleted: "✓ Commande supprimée !",
    admin_product_deleted: "✓ Produit supprimé !",
    admin_lead_deleted: "✓ Abonné supprimé !",
    admin_order_shipped_zr: "✅ Commande expédiée avec succès via ZR Express !",
    admin_order_shipped_direct: "✅ Commande expédiée directement via le navigateur !",
    admin_error_generic: "Une erreur est survenue lors du traitement.",
    admin_error_server: "Serveur déconnecté.",
    admin_error_zr_direct_fail: "⚠️ Échec de l'expédition directe : ",
    admin_src_custom: "Ajouté manuellement",
    admin_src_default: "Par défaut",
    admin_no_sizes: "Aucune taille",
    admin_btn_sync: "🔄 Mettre à jour",
    admin_btn_delete_order: "🗑️ Supprimer la commande",
    admin_dropdown_status_header: "Mettre à jour le statut",
    admin_dropdown_shipping_header: "Étapes d'expédition",
    admin_btn_ship_zr: "🚀 Expédier via ZR Express",
    admin_btn_view_mockup: "🎨 Voir le design / Mockup",
    admin_confirm_ship_zr: "Voulez-vous envoyer la commande #{id} à ZR Express pour expédition ?",
    admin_err_update_status_server: "⚠️ Impossible de mettre à jour le statut. Assurez-vous que le serveur est en cours d'exécution.",
    admin_confirm_delete_order: "Êtes-vous sûr de vouloir supprimer définitivement la commande #{id} ?",
    admin_confirm_delete_product: "Êtes-vous sûr de vouloir supprimer définitivement ce produit ?",
    admin_confirm_delete_product_default: "Êtes-vous sûr de vouloir supprimer ce produit par défaut de la boutique ?",
    admin_confirm_delete_lead: "Êtes-vous sûr de vouloir supprimer cet abonné ? {email}",
    
    // Statuses
    status_pending: "En attente",
    status_confirmed: "Confirmé",
    status_ready: "Prêt à expédier",
    status_delivery: "En livraison",
    status_delivered: "Livré",
    status_returned: "Retourné",
    status_cancelled: "Annulé",
    
    // Table Headers
    admin_col_order_id: "N° Commande",
    admin_col_date: "Date",
    admin_col_customer: "Client",
    admin_col_phone: "Téléphone",
    admin_col_wilaya: "Wilaya",
    admin_col_delivery: "Livraison",
    admin_col_items: "Articles demandés",
    admin_col_total: "Total",
    admin_col_status: "Statut",
    admin_col_actions: "Actions",
    admin_col_image: "Image",
    admin_col_name: "Nom",
    admin_col_category: "Catégorie / Description",
    admin_col_price: "Prix",
    admin_col_badge: "Badge",
    admin_col_rating: "Évaluation",
    admin_col_sizes: "Tailles disponibles",
    admin_col_source: "Source",
  },
  ar: {
    announcement: "توصيل سريع لـ 58 ولاية والدفع عند الاستلام",
    nav_new_arrivals: "جديدنا", nav_collection: "المجموعة", nav_about: "من نحن",
    nav_dashboard: "لوحة التحكم", nav_shop_now: "تسوق الآن",
    nav_best_sellers: "الأكثر مبيعاً",
    nav_shop: "المتجر",
    nav_shop_all: "الكل",
    nav_shop_denim: "جينز",
    nav_shop_jackets: "جاكيتات",
    nav_shop_hoodies: "هوديز",
    nav_about_brand: "من نحن AIZO.DZ",
    nav_faq: "الأسئلة الشائعة",
    nav_shipping: "الشحن والتوصيل",
    nav_contact: "اتصل بنا",
    country_modal_title: "اختر الدولة / العملة",
    search_placeholder: "اكتب للبحث...",
    hero_shop_now: "تسوق الآن",
    cat_shop_by: "تسوق حسب الفئة", cat_all: "الكل", cat_jeans: "جينز",
    cat_jackets: "جاكيتات", cat_hoodies: "هوديز",
    cat_shop_denim: "تسوق الجينز", cat_shop_jackets: "تسوق الجاكيتات", cat_shop_hoodies: "تسوق الهوديز",
    col_eyebrow: "جديدنا", col_title: "المجموعة", col_view_all: "عرض الكل ←",
    col_load_more: "تحميل المزيد", col_add_to_cart: "أضف إلى السلة",
    about_eyebrow: "من نحن",
    about_title: "أشياء تهم.<br/><em>لحظات تدوم.</em>",
    about_body: "ولدت aizo.dz من إيمان بأن الأشياء اليومية يجب أن تكون جميلة وعملية ومقصودة. نحن نبحث وننتقي أرقى القطع — كل واحدة منها مختارة لرفع العادي إلى استثنائي.",
    nl_eyebrow: "ابقَ على اطلاع",
    nl_title: "انضم إلى<br/><em>الدائرة الخاصة.</em>",
    nl_body: "كن أول من يعرف عن الوافدين الجدد والعروض الحصرية والقصص وراء كل قطعة.",
    nl_placeholder: "بريدك الإلكتروني", nl_subscribe: "اشترك",
    nl_success: "✓ شكراً — أنت مسجل الآن.",
    feat_delivery: "توصيل سريع لـ 58 ولاية",
    feat_delivery_desc: "توصيل سريع وآمن لكافة الولايات في الجزائر.",
    feat_auth: "ضمان الأصالة",
    feat_auth_desc: "كل منتج يتم التحقق منه يدوياً قبل وصوله إليك.",
    feat_returns: "إرجاع سهل",
    feat_returns_desc: "إرجاع بدون متاعب خلال 14 يوماً. بدون أسئلة.",
    foot_tagline: "أساسيات منتقاة لحياة أكثر قصداً.<br/>صنع بفخر في الجزائر.",
    foot_shop: "المتجر", foot_new_arrivals: "جديدنا", foot_best_sellers: "الأكثر مبيعاً",
    foot_home_living: "المنزل والمعيشة", foot_accessories: "إكسسوارات", foot_gift_sets: "علب الهدايا",
    foot_info: "معلومات", foot_our_story: "قصتنا", foot_shipping: "الشحن والإرجاع",
    foot_privacy: "سياسة الخصوصية", foot_terms: "شروط الاستخدام", foot_faq: "الأسئلة الشائعة",
    foot_contact: "اتصل بنا",
    foot_copy: "© 2026 AIZO.DZ — جميع الحقوق محفوظة.", foot_made: "صنع بنية · الجزائر",
    cart_title_ar: "سلة المشتريات", cart_title_en: "/ Cart",
    cart_empty_ar: "السلة فارغة حالياً", cart_empty_en: "سلة التسوق فارغة",
    cart_shop_now: "تسوق الآن",
    cart_subtotal: "المجموع الفرعي", cart_shipping_label: "الشحن", cart_total: "الإجمالي",
    cart_free: "مجاّني",
    checkout_title_ar: "معلومات التوصيل", checkout_title_en: "/ Delivery Info",
    checkout_name_label: "الاسم *", checkout_name_ph: "الاسم الشخصي",
    checkout_surname_label: "اللقب *", checkout_surname_ph: "اللقب العائلي",
    checkout_phone_label: "رقم الهاتف *", checkout_phone_ph: "05 / 06 / 07 XX XX XX XX",
    checkout_wilaya_label: "الولاية *", checkout_wilaya_ph: "اختر الولاية...",
    checkout_delivery_type: "نوع التوصيل *",
    delivery_home: "التوصيل إلى المنزل (A DOMICILE)",
    delivery_home_desc: "الدفع عند الاستلام بباب المنزل",
    delivery_office: "التوصيل إلى المكتب (STOP DESK)",
    delivery_office_desc: "الاستلام من مكتب شركة التوصيل",
    checkout_address_label: "العنوان التفصيلي *",
    checkout_address_ph: "مثال: حي السلام، شارع الأمير، رقم 12، الطابق الثاني",
    checkout_office_label: "مكتب التوصيل *", checkout_office_ph: "اختر مكتب التوصيل...",
    checkout_confirm: "تأكيد الطلب", checkout_sending: "جاري إرسال الطلب...",
    err_name: "يرجى إدخال الاسم",
    err_surname: "يرجى إدخال اللقب",
    err_phone: "يرجى إدخال رقم هاتف صحيح (10 أرقام)",
    err_wilaya: "يرجى اختيار الولاية", err_address: "يرجى إدخال عنوان المنزل",
    err_office: "يرجى اختيار مكتب التوصيل",
    success_title: "تم تسجيل طلبك بنجاح!",
    success_subtitle: "شكراً لثقتكم. سنقوم بالاتصال بكم هاتفياً قريباً لتأكيد الطلب وشحنه.",
    success_order_label: "رقم الطلب:", success_name_label: "الاسم:",
    success_phone_label: "الهاتف:", success_wilaya_label: "الولاية:",
    success_delivery_label: "التوصيل إلى:", success_total_label: "المجموع الإجمالي:",
    success_continue: "متابعة التسوق",
    lead_title: "انضم إلينا", lead_desc_ar: "اشترك في قائمتنا البريدية للحصول على آخر التحديثات والمجموعات الجديدة الحصرية.",
    lead_desc_en: "اشترك للحصول على آخر الأخبار.",
    lead_placeholder: "بريدك الإلكتروني", lead_subscribe: "اشترك الآن",
    lead_success_title: "شكراً لتسجيلك!", lead_success_desc: "تم تسجيل بريدك بنجاح. سنبقيك على اطلاع.",
    marquee_1: "جودة عالية", marquee_2: "توصيل سريع لـ 58 ولاية",
    marquee_3: "منتقاة في الجزائر", marquee_4: "حياة واعية",
    marquee_5: "إرجاع خلال 14 يوم", marquee_6: "ضمان الأصالة",
    coll_hero_title: "المجموعة", coll_hero_desc: "أساسيات بسيطة صُممت بدقة وقصد.",
    coll_search_label: "البحث عن منتجات", coll_search_ph: "اكتب للبحث...",
    coll_categories: "الفئات", coll_all: "جميع المنتجات", coll_denim: "جينز / دينيم",
    coll_jackets: "جاكيتات", coll_hoodies: "هوديز", coll_sort: "ترتيب حسب",
    coll_featured: "الأكثر رواجاً", coll_price_asc: "السعر: من الأقل", coll_price_desc: "السعر: من الأعلى",
    coll_name_asc: "أ-ي", coll_name_desc: "ي-أ",
    coll_showing: "عرض", coll_products: "منتج", coll_curated: "ستريت وير منتقى",
    pick_color: "اختر اللون / Select Color", pick_size: "اختر المقاس / Select Size",
    no_offices: "لا توجد مكاتب توصيل متوفرة في هذه الولاية", choose_office_first: "يرجى اختيار الولاية أولاً...",
    pd_color: "اللون",
    pd_size: "المقاس",
    pd_custom_order: "طلب مخصص",
    pd_feat_shipping: "توصيل سريع لـ 58 ولاية",
    pd_feat_quality: "جودة ممتازة مضمونة",
    pd_feat_returns: "استبدال أو إرجاع خلال 14 يوم",
    co_title: "🎨 تخصيص المنتج الفاخر",
    co_step_design: "التصميم",
    co_step_options: "الخيارات",
    co_step_info: "معلومات الزبون",
    co_step_summary: "الملخص",
    co_area_center: "وسط الصدر",
    co_area_chest_left: "الصدر يسار",
    co_area_chest_right: "الصدر يمين",
    co_area_back: "الظهر",
    co_area_sleeve_right: "الكم الأيمن",
    co_area_sleeve_left: "الكم الأيسر",
    co_upload: "تحميل التصميم",
    co_delete: "حذف المحدد",
    co_garment_color: "لون قطعة الملابس",
    co_size: "المقاس",
    co_service_type: "نوع الخدمة",
    co_embroidery: "تطريز",
    co_print: "طباعة",
    co_active: "مفعل",
    co_coming_soon: "قريباً",
    co_name: "الاسم الأول *",
    co_surname: "اللقب *",
    co_email: "البريد الإلكتروني *",
    co_phone: "رقم الهاتف *",
    co_province: "الولاية *",
    co_notes: "ملاحظات إضافية (مثال: أبعاد التصميم)",
    co_order_summary: "ملخص الطلب",
    co_product: "المنتج",
    co_placements: "أماكن التصاميم",
    co_customer: "الزبون",
    co_prev: "← السابق",
    co_next: "التالي →",
    co_confirm: "✓ تأكيد الطلب المخصص",
    co_success_title: "تم إرسال طلبك بنجاح!",
    co_success_desc: "لقد تلقينا طلبك المخصص بنجاح. سيتصل بك فريقنا قريباً لتأكيد التفاصيل.",
    co_success_close: "إغلاق",
    co_garment_type: "نوع الملابس",
    co_upload_title: "تحميل تصاميمك (PNG بخلفية شفافة)",
    co_drag_drop: "اسحب وأسقط شعاراتك هنا",
    co_click_browse: "أو انقر لتصفح الملفات",
    co_active_designs: "تصاميمي النشطة",
    co_delivery_info_title: "معلومات التوصيل",
    co_delivery_info_desc: "يرجى ملء معلوماتك الشخصية لتأكيد طلبك المخصص.",
    co_name_ph: "الاسم الأول",
    co_surname_ph: "اللقب",
    co_email_ph: "مثال: email@example.com",
    co_phone_ph: "05 / 06 / 07 XX XX XX XX",
    co_notes_ph: "تعليمات خاصة... مثال: التطريز بخيوط ذهبية، أبعاد الشعار بدقة...",
    co_num_designs: "عدد التصاميم",
    co_summary_desc: "يرجى التحقق من المعلومات أدناه قبل إرسال طلبك بشكل نهائي.",
    reviews: "تقييم",

    // Admin Dashboard
    admin_login_title: "تسجيل الدخول للمشرف",
    admin_login_desc: "يرجى إدخال الرمز السري للوصول إلى لوحة التحكم",
    admin_login_pwd_ph: "الرمز السري",
    admin_login_btn: "دخول لوحة التحكم",
    admin_back_store: "← العودة إلى المتجر",
    admin_sidebar_role: "مسؤول المتجر",
    admin_logout: "تسجيل الخروج",
    admin_title_panel_stats: "الإحصائيات العامة",
    admin_title_panel_orders: "إدارة الطلبات",
    admin_title_panel_leads: "قائمة الإيميلات",
    admin_title_panel_add_product: "إضافة منتج جديد",
    admin_title_panel_products: "قائمة المنتجات",
    admin_title_panel_custom_orders: "🎨 طلبات خاصة / Custom Orders",
    admin_custom_orders_desc: "جميع الطلبات التي تحتوي على تصميمات مخصصة من العملاء.",
    admin_custom_orders_total_label: "إجمالي الطلبات الخاصة",
    admin_custom_orders_pending_label: "طلبات معلقة",
    admin_custom_orders_empty: "لا توجد طلبات خاصة مطابقة.",
    admin_nav_stats: "✦ الإحصائيات العامة",
    admin_nav_orders: "📦 إدارة الطلبات",
    admin_nav_custom_orders: "🎨 طلبات خاصة",
    admin_nav_leads: "📧 قائمة الإيميلات",
    admin_nav_add_product: "✨ إضافة منتج جديد",
    admin_nav_products: "🛍️ قائمة المنتجات",
    admin_profile_status: "لوحة المشرف متصلة",
    admin_server_disconnected: "الخادم غير متصل",
    admin_sales_total: "إجمالي المبيعات المؤكدة",
    admin_sales_sub: "من الطلبات المؤكدة فقط",
    admin_orders_total: "إجمالي عدد الطلبات",
    admin_orders_pending: "طلب معلق في الانتظار",
    admin_products_active: "عدد المنتجات النشطة",
    admin_products_sub: "المعروضة حالياً بالمتجر",
    admin_leads_total: "إجمالي المشتركين (Leads)",
    admin_leads_sub: "بريد إلكتروني مسجّل",
    admin_returned_total: "الطلبات المُرجعة (Returned)",
    admin_returned_sub: "مُرجعة من ZR Express",
    admin_delivered_total: "الطلبات المسلمة (Delivered)",
    admin_delivered_sub: "تم تسليمها للزبائن",
    admin_recent_orders: "آخر الطلبات الواردة",
    admin_login_error: "الرمز السري غير صحيح!",
    admin_back_store_sidebar: "← العودة للمتجر",
    admin_form_add_title: "إضافة منتج جديد للمتجر",
    admin_form_add_desc: "املأ التفاصيل التالية ليتم عرض المنتج مباشرة في الصفحة الرئيسية للمتجر.",
    admin_form_edit_title: "تعديل منتج: ",
    admin_form_prod_name: "اسم المنتج *",
    admin_form_prod_name_ph: "مثال: Vescartes Ronin Jacket",
    admin_form_prod_sub: "الوصف المختصر (Collection/Subtitle) *",
    admin_form_prod_sub_ph: "مثال: Edo collection أو Vescartes",
    admin_form_prod_price: "السعر (DZD) *",
    admin_form_prod_price_ph: "مثال: 12500",
    admin_form_prod_badge: "علامة المنتج (Badge) - اختياري",
    admin_form_badge_none: "لا توجد علامة",
    admin_form_prod_stars: "التقييم الافتراضي (النجوم) *",
    admin_form_prod_reviews: "عدد المراجعات الافتراضي *",
    admin_form_prod_stock: "كمية المخزون (Inventory Count) *",
    admin_form_prod_img: "رابط صورة المنتج (URL) *",
    admin_form_prod_img_ph: "أدخل رابط صورة مباشر من الإنترنت (أو ضع صورة Pinterest/Imgur)",
    admin_form_prod_img_help: "يمكنك نسخ رابط أي صورة للملابس من الإنترنت لاستخدامها كصورة توضيحية.",
    admin_form_prod_colors_chk: "هل يحتوي المنتج على ألوان خيارية؟ (Enable color options)",
    admin_form_prod_colors: "الألوان المتاحة (افصل بينها بفاصلة) *",
    admin_form_prod_colors_ph: "مثال: أسود, أبيض, أزرق",
    admin_form_prod_colors_help: "ادخل ألوان المنتج مفصولة بفاصلة. ستُستخدم في خيارات الإضافة للسلة.",
    admin_form_prod_sizes: "المقاسات المتاحة للمنتج (اختر واحداً أو أكثر) *",
    admin_form_prod_sizes_help: "إذا لم يتم اختيار أي مقاس، سيُستخدم مقاس M افتراضياً لضمان توفر المخزون.",
    admin_form_btn_save: "حفظ وإضافة المنتج للمتجر",
    admin_form_btn_update: "تحديث وتعديل المنتج",
    admin_form_btn_reset: "إعادة التعيين",
    admin_toast_add_success: "✓ تم إضافة المنتج بنجاح وتحديث المتجر!",
    admin_toast_edit_success: "✓ تم تعديل المنتج وتحديث المتجر بنجاح!",
    admin_toast_zr_success: " — تم نشر المنتج إلى ZR Express",
    admin_products_title: "المنتجات المعروضة بالمتجر",
    admin_products_desc: "يمكنك استعراض جميع المنتجات (الافتراضية والمضافة يدوياً). كما يمكنك حذف المنتجات المضافة يدوياً.",
    admin_leads_title: "قائمة المشتركين / Email Leads",
    admin_leads_desc: "جميع الإيميلات المسجّلة عبر نافذة الاشتراك في المتجر.",
    admin_leads_total_label: "إجمالي المشتركين",
    admin_leads_latest_label: "أحدث اشتراك",
    admin_col_actions_edit: "تعديل",
    admin_col_actions_delete: "حذف",
    admin_products_empty: "لم يتم تحميل المنتجات بعد.",
    admin_leads_empty: "لا يوجد مشتركون بعد.",
    admin_pagination_prev: "السابق",
    admin_pagination_next: "التالي",
    admin_pagination_page: "الصفحة",
    admin_pagination_of: "من",
    admin_orders_empty: "لا توجد طلبات مطابقة.",
    admin_orders_recent_empty: "لا توجد طلبات مسجّلة بعد.",
    admin_spec_color: "اللون:",
    admin_spec_size: "مقاس:",
    admin_spec_qty: "عدد:",
    admin_order_spec_title: "تفاصيل التصميم المخصص / Custom Order Details",
    admin_order_spec_color: "اللون / Couleur:",
    admin_order_spec_size: "المقاس / Taille:",
    admin_order_spec_service: "الخدمة / Service:",
    admin_order_spec_client: "الزبون / Client:",
    admin_order_spec_email: "البريد الإلكتروني / Email:",
    admin_order_spec_phone: "الهاتف / Téléphone:",
    admin_order_spec_province: "الولاية / Province:",
    admin_order_spec_notes: "ملاحظات العميل / Notes:",
    admin_order_spec_no_notes: "لا توجد ملاحظات",
    admin_order_spec_final_mockup: "معاينة النموذج النهائي / Final Mockup",
    admin_order_spec_files: "ملفات التصاميم المرفقة / Uploaded Layers",
    admin_order_spec_download: "تحميل الملف الأصلي / Download Design",
    admin_order_spec_no_files: "لا توجد تصاميم مرفقة",
    admin_status_updated: "✓ تم تحديث حالة الطلب بنجاح!",
    admin_order_deleted: "✓ تم حذف الطلب بنجاح!",
    admin_product_deleted: "✓ تم حذف المنتج بنجاح!",
    admin_lead_deleted: "✓ تم حذف المشترك بنجاح!",
    admin_order_shipped_zr: "✅ تم الشحن بنجاح عبر ZR Express!",
    admin_order_shipped_direct: "✅ تم الشحن بنجاح مباشرة عبر المتصفح!",
    admin_error_generic: "حدث خطأ أثناء المعالجة",
    admin_error_server: "الخادم غير متصل",
    admin_error_zr_direct_fail: "⚠️ فشل الشحن المباشر: ",
    admin_src_custom: "مضاف يدوياً",
    admin_src_default: "افتراضي",
    admin_no_sizes: "بدون مقاس",
    admin_btn_sync: "🔄 تحديث",
    admin_btn_delete_order: "🗑️ حذف الطلب",
    admin_dropdown_status_header: "تحديث الحالة / Statut",
    admin_dropdown_shipping_header: "مراحل الشحن / Expédition",
    admin_btn_ship_zr: "🚀 شحن عبر ZR Express",
    admin_btn_view_mockup: "🎨 عرض التصميم / Mockup",
    admin_confirm_ship_zr: "هل تريد إرسال الطلب #{id} إلى ZR Express للشحن؟",
    admin_err_update_status_server: "⚠️ تعذّر تحديث حالة الطلب. تأكد من تشغيل السيرفر.",
    admin_confirm_delete_order: "هل أنت متأكد من حذف الطلب #{id} نهائياً؟",
    admin_confirm_delete_product: "هل أنت متأكد من حذف هذا المنتج نهائياً؟",
    admin_confirm_delete_product_default: "هل أنت متأكد من حذف هذا المنتج الافتراضي من المتجر؟",
    admin_confirm_delete_lead: "هل أنت متأكد من حذف هذا المشترك؟ {email}",
    
    // Statuses
    status_pending: "قيد الانتظار",
    status_confirmed: "مؤكد",
    status_ready: "جاهز للشحن",
    status_delivery: "قيد التوصيل",
    status_delivered: "تم التسليم",
    status_returned: "مُرجع",
    status_cancelled: "ملغى",
    
    // Table Headers
    admin_col_order_id: "رقم الطلب",
    admin_col_date: "تاريخ الطلب",
    admin_col_customer: "الزبون",
    admin_col_phone: "الهاتف",
    admin_col_wilaya: "الولاية",
    admin_col_delivery: "نوع التوصيل",
    admin_col_items: "المنتجات المطلوبة",
    admin_col_total: "المجموع",
    admin_col_status: "الحالة",
    admin_col_actions: "الإجراءات",
    admin_col_image: "الصورة",
    admin_col_name: "الاسم",
    admin_col_category: "الفئة / الوصف",
    admin_col_price: "السعر",
    admin_col_badge: "العلامة",
    admin_col_rating: "التقييم",
    admin_col_sizes: "المقاسات المتاحة",
    admin_col_source: "المصدر",
  },
  en: {
    announcement: "FAST SHIPPING 58 WILAYAS & CASH ON DELIVERY",
    nav_new_arrivals: "New Arrivals", nav_collection: "The Collection", nav_about: "About Us",
    nav_dashboard: "Dashboard", nav_shop_now: "Shop Now",
    nav_best_sellers: "Best Sellers",
    nav_shop: "Shop",
    nav_shop_all: "All",
    nav_shop_denim: "Denim",
    nav_shop_jackets: "Jackets",
    nav_shop_hoodies: "Hoodies",
    nav_about_brand: "About AIZO.DZ",
    nav_faq: "FAQs",
    nav_shipping: "Shipping & Delivery",
    nav_contact: "Contact",
    country_modal_title: "Country / Currency",
    search_placeholder: "Type to search...",
    hero_shop_now: "SHOP NOW",
    cat_shop_by: "Shop by Category", cat_all: "All", cat_jeans: "Jeans",
    cat_jackets: "Jackets", cat_hoodies: "Hoodies",
    cat_shop_denim: "Shop Denim", cat_shop_jackets: "Shop Jackets", cat_shop_hoodies: "Shop Hoodies",
    col_eyebrow: "New Arrivals", col_title: "The Collection", col_view_all: "View All →",
    col_load_more: "Load More", col_add_to_cart: "Add to Cart",
    about_eyebrow: "Who we are",
    about_title: "Objects that matter.<br/><em>Moments that last.</em>",
    about_body: "aizo.dz was born from a belief that everyday objects should be beautiful, functional, and intentional. We source and curate the finest pieces — each one chosen to elevate the ordinary into the extraordinary.",
    nl_eyebrow: "Stay in the know",
    nl_title: "Join the<br/><em>inner circle.</em>",
    nl_body: "Be the first to hear about new arrivals, exclusive offers, and the stories behind each piece.",
    nl_placeholder: "Your email address", nl_subscribe: "Subscribe",
    nl_success: "✓ Thank you — you're on the list.",
    feat_delivery: "Fast Delivery 58 Wilayas",
    feat_delivery_desc: "Fast and secure delivery across all wilayas in Algeria.",
    feat_auth: "Authenticity Guarantee",
    feat_auth_desc: "Every product is hand-verified for quality before it reaches you.",
    feat_returns: "Easy Returns",
    feat_returns_desc: "14-day hassle-free returns. No questions asked.",
    foot_tagline: "Curated essentials for a more intentional life.<br/>Proudly Algerian.",
    foot_shop: "Shop", foot_new_arrivals: "New Arrivals", foot_best_sellers: "Best Sellers",
    foot_home_living: "Home & Living", foot_accessories: "Accessories", foot_gift_sets: "Gift Sets",
    foot_info: "Info", foot_our_story: "Our Story", foot_shipping: "Shipping & Returns",
    foot_privacy: "Privacy Policy", foot_terms: "Terms of Use", foot_faq: "FAQ",
    foot_contact: "Contact",
    foot_copy: "© 2026 AIZO.DZ — All rights reserved.", foot_made: "Made with intention · Algeria",
    cart_title_ar: "سلة المشتريات", cart_title_en: "/ Cart",
    cart_empty_ar: "Your cart is empty", cart_empty_en: "Your cart is empty",
    cart_shop_now: "Shop Now",
    cart_subtotal: "Subtotal", cart_shipping_label: "Shipping", cart_total: "Total",
    cart_free: "Free",
    checkout_title_ar: "Delivery Info", checkout_title_en: "/ Delivery Info",
    checkout_name_label: "First Name *", checkout_name_ph: "First name",
    checkout_surname_label: "Last Name *", checkout_surname_ph: "Last name",
    checkout_phone_label: "Phone Number *", checkout_phone_ph: "05 / 06 / 07 XX XX XX XX",
    checkout_wilaya_label: "State *", checkout_wilaya_ph: "Select state...",
    checkout_delivery_type: "Delivery Type *",
    delivery_home: "Home Delivery (A DOMICILE)",
    delivery_home_desc: "Cash on delivery at your door",
    delivery_office: "Office Delivery (STOP DESK)",
    delivery_office_desc: "Pick up from delivery office",
    checkout_address_label: "Home Address *",
    checkout_address_ph: "e.g., Cité la paix, rue de l'émir, n°12, 2nd floor",
    checkout_office_label: "Shipping Office *", checkout_office_ph: "Select office...",
    checkout_confirm: "Confirm Order", checkout_sending: "Sending...",
    err_name: "Please enter first name",
    err_surname: "Please enter last name",
    err_phone: "Please enter a valid phone number (10 digits)",
    err_wilaya: "Please select a state", err_address: "Please enter home address",
    err_office: "Please select a shipping office",
    success_title: "Your order has been placed!",
    success_subtitle: "Thank you for your trust. We will contact you soon to confirm and ship your order.",
    success_order_label: "Order #:", success_name_label: "Name:",
    success_phone_label: "Phone:", success_wilaya_label: "State:",
    success_delivery_label: "Delivery to:", success_total_label: "Total:",
    success_continue: "Continue Shopping",
    lead_title: "Join Us", lead_desc_ar: "Subscribe to our newsletter for updates and exclusive collections.",
    lead_desc_en: "Subscribe for latest news and exclusive drops.",
    lead_placeholder: "Your email address", lead_subscribe: "Subscribe",
    lead_success_title: "Thank You!", lead_success_desc: "Your email has been registered.",
    marquee_1: "Premium Quality", marquee_2: "Fast Delivery 58 Wilayas",
    marquee_3: "Curated in Algeria", marquee_4: "Mindful Living",
    marquee_5: "14-Day Returns", marquee_6: "Authenticity Guaranteed",
    coll_hero_title: "The Collection", coll_hero_desc: "Minimalist essentials designed with precision and intention.",
    coll_search_label: "Search Products", coll_search_ph: "Type to search...",
    coll_categories: "Categories", coll_all: "All Products", coll_denim: "Denim / Jeans",
    coll_jackets: "Jackets", coll_hoodies: "Hoodies", coll_sort: "Sort By",
    coll_featured: "Featured", coll_price_asc: "Price: Low to High", coll_price_desc: "Price: High to Low",
    coll_name_asc: "Alphabetically: A-Z", coll_name_desc: "Alphabetically: Z-A",
    coll_showing: "Showing", coll_products: "products", coll_curated: "Curated Streetwear",
    pick_color: "اختر اللون / Select Color", pick_size: "اختر المقاس / Select Size",
    no_offices: "No delivery offices available in this state", choose_office_first: "Please select a state first...",
    pd_color: "Color",
    pd_size: "Size",
    pd_custom_order: "Custom Order",
    pd_feat_shipping: "Fast Shipping 58 Wilayas",
    pd_feat_quality: "Premium Quality Guaranteed",
    pd_feat_returns: "14-Day Returns & Exchanges",
    co_title: "🎨 Premium Customization",
    co_step_design: "Design",
    co_step_options: "Options",
    co_step_info: "Customer Info",
    co_step_summary: "Summary",
    co_area_center: "Center Chest",
    co_area_chest_left: "Left Chest",
    co_area_chest_right: "Right Chest",
    co_area_back: "Back",
    co_area_sleeve_right: "Right Sleeve",
    co_area_sleeve_left: "Left Sleeve",
    co_upload: "Upload Design",
    co_delete: "Delete Selected",
    co_garment_color: "Garment Color",
    co_size: "Garment Size",
    co_service_type: "Production Method",
    co_embroidery: "Embroidery",
    co_print: "Printing",
    co_active: "Active",
    co_coming_soon: "Soon",
    co_name: "First Name *",
    co_surname: "Last Name *",
    co_email: "Email *",
    co_phone: "Phone Number *",
    co_province: "Wilaya *",
    co_notes: "Special Notes (e.g., specific sizing)",
    co_order_summary: "Order Summary",
    co_product: "Product",
    co_placements: "Placements",
    co_customer: "Customer",
    co_prev: "← Previous",
    co_next: "Next →",
    co_confirm: "✓ Confirm Custom Order",
    co_success_title: "Order Submitted Successfully!",
    co_success_desc: "We have received your custom order. Our team will contact you shortly.",
    co_success_close: "Close",
    co_garment_type: "Garment Type",
    co_upload_title: "Upload your designs (transparent PNG)",
    co_drag_drop: "Drag & drop your logos here",
    co_click_browse: "Or click to browse files",
    co_active_designs: "My Active Designs",
    co_delivery_info_title: "Delivery Information",
    co_delivery_info_desc: "Please fill in your details to record your custom order.",
    co_name_ph: "Your first name",
    co_surname_ph: "Your last name",
    co_email_ph: "e.g. email@example.com",
    co_phone_ph: "05 / 06 / 07 XX XX XX XX",
    co_notes_ph: "Special instructions... e.g., gold thread embroidery, exact logo dimensions...",
    co_num_designs: "Number of designs",
    co_summary_desc: "Please verify the information below before final submission.",
    reviews: "reviews",

    // Admin Dashboard
    admin_login_title: "Administrator Login",
    admin_login_desc: "Please enter the secret password to access the admin panel.",
    admin_login_pwd_ph: "Password",
    admin_login_btn: "Enter Dashboard",
    admin_back_store: "← Back to Storefront",
    admin_sidebar_role: "Store Manager",
    admin_logout: "Log Out",
    admin_title_panel_stats: "General Statistics",
    admin_title_panel_orders: "Order Management",
    admin_title_panel_leads: "Email Subscribers List",
    admin_title_panel_add_product: "Add New Product",
    admin_title_panel_products: "Products List",
    admin_title_panel_custom_orders: "Special / Custom Orders",
    admin_custom_orders_desc: "All orders containing custom designs from customers.",
    admin_custom_orders_total_label: "Total Custom Orders",
    admin_custom_orders_pending_label: "Pending Orders",
    admin_custom_orders_empty: "No matching custom orders found.",
    admin_nav_stats: "✦ Statistics",
    admin_nav_orders: "📦 Manage Orders",
    admin_nav_custom_orders: "🎨 Special Orders",
    admin_nav_leads: "📧 Email List",
    admin_nav_add_product: "✨ Add New Product",
    admin_nav_products: "🛍️ Products List",
    admin_profile_status: "Admin Dashboard Connected",
    admin_server_disconnected: "Server Disconnected",
    admin_sales_total: "Total Confirmed Sales",
    admin_sales_sub: "From confirmed orders only",
    admin_orders_total: "Total Orders Count",
    admin_orders_pending: "pending order(s) waiting",
    admin_products_active: "Active Products Count",
    admin_products_sub: "Currently displayed in shop",
    admin_leads_total: "Total Subscribers (Leads)",
    admin_leads_sub: "Registered emails",
    admin_returned_total: "Returned Orders",
    admin_returned_sub: "Returned by ZR Express",
    admin_delivered_total: "Delivered Orders",
    admin_delivered_sub: "Successfully delivered to customers",
    admin_recent_orders: "Latest Incoming Orders",
    admin_login_error: "The password is incorrect!",
    admin_back_store_sidebar: "← Back to Storefront",
    admin_form_add_title: "Add New Product to Store",
    admin_form_add_desc: "Fill in the details below to display the product directly on the store homepage.",
    admin_form_edit_title: "Edit Product: ",
    admin_form_prod_name: "Product Name *",
    admin_form_prod_name_ph: "E.g. Vescartes Ronin Jacket",
    admin_form_prod_sub: "Short Description (Collection/Subtitle) *",
    admin_form_prod_sub_ph: "E.g. Edo collection or Vescartes",
    admin_form_prod_price: "Price (DZD) *",
    admin_form_prod_price_ph: "E.g. 12500",
    admin_form_prod_badge: "Product Badge (Optional)",
    admin_form_badge_none: "No badge",
    admin_form_prod_stars: "Default Rating (Stars) *",
    admin_form_prod_reviews: "Default Review Count *",
    admin_form_prod_stock: "Inventory Count (Stock) *",
    admin_form_prod_img: "Product Image URL *",
    admin_form_prod_img_ph: "Enter a direct image link (Pinterest, Imgur, etc.)",
    admin_form_prod_img_help: "You can copy the link of any clothing image from the internet to use.",
    admin_form_prod_colors_chk: "Does this product have color options?",
    admin_form_prod_colors: "Available Colors (comma separated) *",
    admin_form_prod_colors_ph: "E.g. Black, White, Blue",
    admin_form_prod_colors_help: "Enter colors separated by commas. These will be used in adding to cart.",
    admin_form_prod_sizes: "Available Sizes (choose one or more) *",
    admin_form_prod_sizes_help: "If no size is selected, M will be used as the default size.",
    admin_form_btn_save: "Save and Add Product",
    admin_form_btn_update: "Update Product",
    admin_form_btn_reset: "Reset Form",
    admin_toast_add_success: "✓ Product added successfully!",
    admin_toast_edit_success: "✓ Product updated successfully!",
    admin_toast_zr_success: " — Product published to ZR Express",
    admin_products_title: "Products Displayed in Store",
    admin_products_desc: "View all default and manual products. You can delete manually added products.",
    admin_leads_title: "Subscriber List / Email Leads",
    admin_leads_desc: "All emails registered through the newsletter subscription in the store.",
    admin_leads_total_label: "Total Subscribers",
    admin_leads_latest_label: "Latest Signup",
    admin_col_actions_edit: "Edit",
    admin_col_actions_delete: "Delete",
    admin_products_empty: "No products loaded yet.",
    admin_leads_empty: "No subscribers yet.",
    admin_pagination_prev: "Previous",
    admin_pagination_next: "Next",
    admin_pagination_page: "Page",
    admin_pagination_of: "of",
    admin_orders_empty: "No matching orders found.",
    admin_orders_recent_empty: "No orders registered yet.",
    admin_spec_color: "Color:",
    admin_spec_size: "Size:",
    admin_spec_qty: "Qty:",
    admin_order_spec_title: "Custom Order Details",
    admin_order_spec_color: "Color:",
    admin_order_spec_size: "Size:",
    admin_order_spec_service: "Service:",
    admin_order_spec_client: "Client:",
    admin_order_spec_email: "Email:",
    admin_order_spec_phone: "Phone:",
    admin_order_spec_province: "Wilaya:",
    admin_order_spec_notes: "Notes:",
    admin_order_spec_no_notes: "No notes",
    admin_order_spec_final_mockup: "Final Mockup Preview",
    admin_order_spec_files: "Attached Design Files",
    admin_order_spec_download: "Download Original Design",
    admin_order_spec_no_files: "No design files attached",
    admin_status_updated: "✓ Order status updated!",
    admin_order_deleted: "✓ Order deleted!",
    admin_product_deleted: "✓ Product deleted!",
    admin_lead_deleted: "✓ Subscriber deleted!",
    admin_order_shipped_zr: "✅ Order shipped successfully via ZR Express!",
    admin_order_shipped_direct: "✅ Shipped successfully directly via browser!",
    admin_error_generic: "An error occurred during processing.",
    admin_error_server: "Server disconnected.",
    admin_error_zr_direct_fail: "⚠️ Direct shipment failed: ",
    admin_src_custom: "Manually added",
    admin_src_default: "Default",
    admin_no_sizes: "No sizes",
    admin_btn_sync: "🔄 Update",
    admin_btn_delete_order: "🗑️ Delete Order",
    admin_dropdown_status_header: "Update Status",
    admin_dropdown_shipping_header: "Shipping Stages",
    admin_btn_ship_zr: "🚀 Ship via ZR Express",
    admin_btn_view_mockup: "🎨 View Design / Mockup",
    admin_confirm_ship_zr: "Do you want to send order #{id} to ZR Express for shipping?",
    admin_err_update_status_server: "⚠️ Cannot update order status. Make sure the server is running.",
    admin_confirm_delete_order: "Are you sure you want to permanently delete order #{id}?",
    admin_confirm_delete_product: "Are you sure you want to permanently delete this product?",
    admin_confirm_delete_product_default: "Are you sure you want to delete this default product from the store?",
    admin_confirm_delete_lead: "Are you sure you want to delete this subscriber? {email}",
    
    // Statuses
    status_pending: "Pending",
    status_confirmed: "Confirmed",
    status_ready: "Ready to Ship",
    status_delivery: "In Delivery",
    status_delivered: "Delivered",
    status_returned: "Returned",
    status_cancelled: "Cancelled",
    
    // Table Headers
    admin_col_order_id: "Order ID",
    admin_col_date: "Date",
    admin_col_customer: "Customer",
    admin_col_phone: "Phone",
    admin_col_wilaya: "Wilaya",
    admin_col_delivery: "Delivery Type",
    admin_col_items: "Ordered Items",
    admin_col_total: "Total Amount",
    admin_col_status: "Status",
    admin_col_actions: "Actions",
    admin_col_image: "Image",
    admin_col_name: "Name",
    admin_col_category: "Category / Description",
    admin_col_price: "Price",
    admin_col_badge: "Badge",
    admin_col_rating: "Rating",
    admin_col_sizes: "Available Sizes",
    admin_col_source: "Source",
  }
};

window.TRANSLATIONS = TRANSLATIONS;

/**
 * Get translation for a key in the current language
 */
window.t = function(key) {
  const lang = window._currentLang || 'fr';
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) || key;
};

/**
 * Set language and translate the entire page
 */
window.setLanguage = function(lang) {
  if (!TRANSLATIONS[lang]) lang = 'fr';
  window._currentLang = lang;
  localStorage.setItem('aizo_lang', lang);

  // Document direction & lang attribute
  if (lang === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', lang === 'fr' ? 'fr' : 'en');
  }

  const localizedLanguageIcon = lang === 'ar'
    ? '🇩🇿'
    : lang === 'fr'
      ? '🇫🇷'
      : '🇺🇸';

  // Update language selector UI
  document.querySelectorAll('.lang-selector').forEach(sel => {
    const labelSpan = sel.querySelector('.lang-btn span');
    if (labelSpan) {
      labelSpan.textContent = localizedLanguageIcon;
    }
    sel.querySelectorAll('.lang-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.lang === lang);
    });
  });
  // Also update any standalone language buttons (floating in navbar)
  document.querySelectorAll('.lang-btn span').forEach(s => { s.textContent = localizedLanguageIcon; });
  document.querySelectorAll('.lang-modal__option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });
  document.querySelectorAll('.side-drawer__lang-current').forEach(el => {
    el.textContent = localizedLanguageIcon;
  });

  refreshLanguageModalState(lang);

  // Batch DOM reads/writes: apply translations in a single rAF
  requestAnimationFrame(() => {
    applyTranslations(lang);

    // Defer heavy dashboard re-renders to next idle frame so language switch feels instant
    if (typeof window.loadDashboardStats === 'function' ||
        typeof window.renderOrdersTable === 'function' ||
        typeof window.renderAdminProductsList === 'function' ||
        typeof window.renderLeadsTable === 'function' ||
        typeof window.renderCustomOrdersTable === 'function') {
      
      // Use requestIdleCallback if available, else setTimeout(0)
      const deferFn = window.requestIdleCallback || ((cb) => setTimeout(cb, 0));
      deferFn(() => {
        if (typeof window.loadDashboardStats === 'function') {
          window.loadDashboardStats(false);
        }
        if (typeof window.renderOrdersTable === 'function') {
          const activeFilterBtn = document.querySelector('#panel-orders .filter-btn.active');
          const activeFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
          window.renderOrdersTable(activeFilter, false);
        }
        if (typeof window.renderCustomOrdersTable === 'function') {
          const activeFilterBtn = document.querySelector('#panel-custom-orders .filter-btn.active');
          const activeFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
          window.renderCustomOrdersTable(activeFilter, false);
        }
        if (typeof window.renderAdminProductsList === 'function') {
          window.renderAdminProductsList(false);
        }
        if (typeof window.renderLeadsTable === 'function') {
          window.renderLeadsTable(false);
        }
      });
    }
  });
};

/**
 * Apply all translations to the current page
 */
function applyTranslations(lang) {
  const tr = TRANSLATIONS[lang];
  if (!tr) return;

  // Helper
  const q = (sel) => document.querySelector(sel);
  const qAll = (sel) => document.querySelectorAll(sel);

  // 1. data-i18n elements (preserving child SVGs and badges cleanly)
  qAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (tr[key] !== undefined) {
      const svg = el.querySelector('svg');
      const badge = el.querySelector('.nav-badge');
      const textSpan = el.querySelector('span:not(.nav-badge)');
      
      if (textSpan) {
        textSpan.textContent = tr[key];
      } else if (svg || badge) {
        const svgClone = svg ? svg.cloneNode(true) : null;
        const badgeClone = badge ? badge.cloneNode(true) : null;
        el.textContent = tr[key];
        if (svgClone) el.insertBefore(svgClone, el.firstChild);
        if (badgeClone) el.appendChild(badgeClone);
      } else {
        el.textContent = tr[key];
      }
    }
  });

  // 1b. data-i18n-placeholder elements
  qAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (tr[key] !== undefined) el.placeholder = tr[key];
  });

  // 2. Announcement bar
  const annoBar = q('.announcement-bar');
  if (annoBar) annoBar.textContent = tr.announcement;

  // 3. Navigation (translated automatically via data-i18n)
  // 4. Mobile Menu (translated automatically via data-i18n)

  // 5. Hero button
  const heroSpan = q('.btn-shop-hero span');
  if (heroSpan) heroSpan.textContent = tr.hero_shop_now;

  // 6. Marquee items
  const mItems = qAll('.marquee__item');
  const mTexts = [tr.marquee_1, tr.marquee_2, tr.marquee_3, tr.marquee_4, tr.marquee_5, tr.marquee_6];
  mItems.forEach((el, i) => { if (mTexts[i % 6] !== undefined) el.textContent = mTexts[i % 6]; });

  // 7. Category banners (index page)
  const catTitle = q('#cat-banners-title');
  if (catTitle) catTitle.textContent = tr.cat_shop_by;
  const catBtns = qAll('.category-banner-card__btn');
  const catBtnTexts = [tr.cat_shop_denim, tr.cat_shop_jackets, tr.cat_shop_hoodies];
  catBtns.forEach((el, i) => { if (catBtnTexts[i]) el.textContent = catBtnTexts[i]; });

  // 8. Collection section (index page)
  const colEyebrow = q('.collection-header .section-eyebrow');
  if (colEyebrow) colEyebrow.textContent = tr.col_eyebrow;
  const colTitle = q('#collection-title');
  if (colTitle) colTitle.textContent = tr.col_title;
  const viewAll = q('.view-all');
  if (viewAll) viewAll.textContent = tr.col_view_all;

  // Category filter buttons
  const filterBtns = qAll('.category-filter .category-btn');
  const filterTexts = [tr.cat_all, tr.cat_jeans, tr.cat_jackets, tr.cat_hoodies];
  filterBtns.forEach((el, i) => { if (filterTexts[i]) el.textContent = filterTexts[i]; });

  // Load more
  const loadMoreBtn = q('#load-more-btn');
  if (loadMoreBtn && !loadMoreBtn.disabled) loadMoreBtn.textContent = tr.col_load_more;

  // 9. About section
  const aboutEye = q('.section-about .section-eyebrow');
  if (aboutEye) aboutEye.textContent = tr.about_eyebrow;
  const aboutTitle = q('#about-title');
  if (aboutTitle) aboutTitle.innerHTML = tr.about_title;
  const aboutBody = q('.section-about .section-body');
  if (aboutBody) aboutBody.textContent = tr.about_body;

  // 10. Newsletter
  const nlEye = q('.section-newsletter .section-eyebrow');
  if (nlEye) nlEye.textContent = tr.nl_eyebrow;
  const nlTitle = q('#nl-title');
  if (nlTitle) nlTitle.innerHTML = tr.nl_title;
  const nlBody = q('.section-newsletter .section-body');
  if (nlBody) nlBody.textContent = tr.nl_body;
  const nlInput = q('#nl-email');
  if (nlInput) nlInput.placeholder = tr.nl_placeholder;
  const nlSubmit = q('#nl-submit');
  if (nlSubmit) nlSubmit.textContent = tr.nl_subscribe;
  const nlSuccess = q('#nl-success');
  if (nlSuccess) nlSuccess.textContent = tr.nl_success;

  // 11. Features
  const featureTitles = qAll('.feature__title');
  const featureBodies = qAll('.feature__body');
  const ft = [tr.feat_delivery, tr.feat_auth, tr.feat_returns];
  const fb = [tr.feat_delivery_desc, tr.feat_auth_desc, tr.feat_returns_desc];
  featureTitles.forEach((el, i) => { if (ft[i]) el.textContent = ft[i]; });
  featureBodies.forEach((el, i) => { if (fb[i]) el.textContent = fb[i]; });

  // 12. Footer
  const ftTagline = q('.footer-tagline');
  if (ftTagline) ftTagline.innerHTML = tr.foot_tagline;

  // Columns and links are translated automatically via data-i18n

  const footCopy = q('.footer__copy');
  if (footCopy) footCopy.textContent = tr.foot_copy;
  const footMade = q('.footer__made');
  if (footMade) footMade.textContent = tr.foot_made;

  // 13. Cart drawer
  const cartDrawerTitle = q('#cart-drawer-title');
  if (cartDrawerTitle) cartDrawerTitle.innerHTML = `${tr.cart_title_ar} <span>${tr.cart_title_en}</span>`;
  const cartEmptyAr = q('.cart-empty__text-ar');
  if (cartEmptyAr) cartEmptyAr.textContent = tr.cart_empty_ar;
  const cartEmptyEn = q('.cart-empty__text-en');
  if (cartEmptyEn) cartEmptyEn.textContent = tr.cart_empty_en;
  const cartShopNow = q('#btn-empty-shop');
  if (cartShopNow) cartShopNow.textContent = tr.cart_shop_now;

  // Cart summary labels
  const summaryRows = qAll('.cart-summary .summary-row');
  if (summaryRows.length >= 3) {
    const subLabel = summaryRows[0].querySelector('span:first-child');
    if (subLabel) subLabel.textContent = tr.cart_subtotal;
    const shipLabel = summaryRows[1].querySelector('span:first-child');
    if (shipLabel) shipLabel.textContent = tr.cart_shipping_label;
    const totalLabel = summaryRows[2].querySelector('span:first-child');
    if (totalLabel) totalLabel.textContent = tr.cart_total;
  }

  // 14. Checkout form
  const checkoutH3 = q('.checkout-form h3');
  if (checkoutH3) checkoutH3.innerHTML = `${tr.checkout_title_ar} <span>${tr.checkout_title_en}</span>`;

  const nameLabel = q('label[for="checkout-name"]');
  if (nameLabel) nameLabel.textContent = tr.checkout_name_label;
  const nameInput = q('#checkout-name');
  if (nameInput) nameInput.placeholder = tr.checkout_name_ph;

  const surnameLabel = q('label[for="checkout-surname"]');
  if (surnameLabel) surnameLabel.textContent = tr.checkout_surname_label;
  const surnameInput = q('#checkout-surname');
  if (surnameInput) surnameInput.placeholder = tr.checkout_surname_ph;

  const phoneLabel = q('label[for="checkout-phone"]');
  if (phoneLabel) phoneLabel.textContent = tr.checkout_phone_label;
  const phoneInput = q('#checkout-phone');
  if (phoneInput) phoneInput.placeholder = tr.checkout_phone_ph;

  const wilayaLabel = q('label[for="checkout-wilaya"]');
  if (wilayaLabel) wilayaLabel.textContent = tr.checkout_wilaya_label;

  const deliveryTypeLabel = q('.delivery-options')?.closest('.form-group')?.querySelector('label');
  if (deliveryTypeLabel && !deliveryTypeLabel.getAttribute('for')) deliveryTypeLabel.textContent = tr.checkout_delivery_type;

  const addressLabel = q('label[for="checkout-address"]');
  if (addressLabel) addressLabel.textContent = tr.checkout_address_label;
  const addressInput = q('#checkout-address');
  if (addressInput) addressInput.placeholder = tr.checkout_address_ph;

  const officeLabel = q('label[for="checkout-office"]');
  if (officeLabel) officeLabel.textContent = tr.checkout_office_label;

  const confirmBtn = q('#btn-confirm-order');
  if (confirmBtn && !confirmBtn.disabled) confirmBtn.textContent = tr.checkout_confirm;

  // Error messages
  const errName = q('#err-name'); if (errName) errName.textContent = tr.err_name;
  const errSurname = q('#err-surname'); if (errSurname) errSurname.textContent = tr.err_surname;
  const errPhone = q('#err-phone'); if (errPhone) errPhone.textContent = tr.err_phone;
  const errWilaya = q('#err-wilaya'); if (errWilaya) errWilaya.textContent = tr.err_wilaya;
  const errAddress = q('#err-address'); if (errAddress) errAddress.textContent = tr.err_address;
  const errOffice = q('#err-office'); if (errOffice) errOffice.textContent = tr.err_office;

  // 15. Success screen
  const successTitle = q('#order-success-screen h2');
  if (successTitle) successTitle.textContent = tr.success_title;
  const successSub = q('.success-subtitle');
  if (successSub) successSub.textContent = tr.success_subtitle;
  const successContinue = q('#btn-success-close');
  if (successContinue) successContinue.textContent = tr.success_continue;

  const detailRows = qAll('.order-details-card .details-row span:first-child');
  const detailLabels = [tr.success_order_label, tr.success_name_label, tr.success_phone_label, tr.success_wilaya_label, tr.success_delivery_label, tr.success_total_label];
  detailRows.forEach((el, i) => { if (detailLabels[i]) el.textContent = detailLabels[i]; });

  // 16. Lead popup
  const leadTitle = q('#lead-popup-title');
  if (leadTitle) leadTitle.textContent = tr.lead_title;
  const leadDescAr = q('.lead-popup__desc-ar');
  if (leadDescAr) leadDescAr.textContent = tr.lead_desc_ar;
  const leadDescEn = q('.lead-popup__desc-en');
  if (leadDescEn) leadDescEn.textContent = tr.lead_desc_en;
  const leadEmail = q('#lead-email');
  if (leadEmail) leadEmail.placeholder = tr.lead_placeholder;
  const leadSubmit = q('#btn-lead-submit');
  if (leadSubmit) leadSubmit.textContent = tr.lead_subscribe;
  const leadSuccessTitle = q('#lead-popup-success h3');
  if (leadSuccessTitle) leadSuccessTitle.textContent = tr.lead_success_title;
  const leadSuccessDesc = q('#lead-popup-success p');
  if (leadSuccessDesc) leadSuccessDesc.textContent = tr.lead_success_desc;

  // 17. Collections page specific
  const collHeroTitle = q('.collections-hero h1');
  if (collHeroTitle) collHeroTitle.textContent = tr.coll_hero_title;
  const collHeroDesc = q('.collections-hero p');
  if (collHeroDesc) collHeroDesc.textContent = tr.coll_hero_desc;

  // Sidebar filters
  const searchLabel = q('label[for="search-input"]');
  if (searchLabel) searchLabel.textContent = tr.coll_search_label;
  const searchInput = q('#search-input');
  if (searchInput) searchInput.placeholder = tr.coll_search_ph;

  const catGroupTitle = q('.filter-group .filter-group__title:not([for])');
  if (catGroupTitle && catGroupTitle.textContent.match(/Categor|فئ/i)) catGroupTitle.textContent = tr.coll_categories;

  const sidebarBtns = qAll('.sidebar-category-btn');
  const sidebarTexts = [tr.coll_all, tr.coll_denim, tr.coll_jackets, tr.coll_hoodies];
  sidebarBtns.forEach((el, i) => { if (sidebarTexts[i]) el.textContent = sidebarTexts[i]; });

  const sortLabel = q('label[for="sort-select"]');
  if (sortLabel) sortLabel.textContent = tr.coll_sort;
  const sortOptions = qAll('#sort-select option');
  const sortTexts = [tr.coll_featured, tr.coll_price_asc, tr.coll_price_desc, tr.coll_name_asc, tr.coll_name_desc];
  sortOptions.forEach((el, i) => { if (sortTexts[i]) el.textContent = sortTexts[i]; });

  const infoBar = q('.collections-info-bar');
  if (infoBar) {
    const spans = infoBar.querySelectorAll('span');
    if (spans.length >= 2) {
      const countEl = spans[0].querySelector('#active-products-count');
      const countVal = countEl ? countEl.textContent : '0';
      spans[0].innerHTML = `${tr.coll_showing} <span id="active-products-count">${countVal}</span> ${tr.coll_products}`;
      spans[1].textContent = tr.coll_curated;
    }
  }

  // 18. Admin Dashboard page translations
  if (q('.admin-wrapper') || q('#login-overlay')) {

    // Panel title (data-i18n driven)
    const panelTitle = q('#panel-title');
    if (panelTitle && panelTitle.getAttribute('data-i18n')) {
      const pKey = panelTitle.getAttribute('data-i18n');
      if (tr[pKey]) panelTitle.textContent = tr[pKey];
    }

    // Server status dot
    const serverStatusText = q('#server-status-text');
    if (serverStatusText) {
      const isDisconnected = serverStatusText.dataset.state === 'disconnected' ||
        serverStatusText.textContent.includes('الخادم غير متصل') ||
        serverStatusText.textContent.toLowerCase().includes('disconnected') ||
        serverStatusText.textContent.toLowerCase().includes('hors ligne');
      serverStatusText.textContent = isDisconnected ? tr.admin_server_disconnected : tr.admin_profile_status;
    }

    // Login form
    const loginH2 = q('#login-overlay h2[data-i18n]');
    if (loginH2) loginH2.textContent = tr[loginH2.getAttribute('data-i18n')] || loginH2.textContent;
    const loginDesc = q('#login-overlay p[data-i18n]');
    if (loginDesc) loginDesc.textContent = tr[loginDesc.getAttribute('data-i18n')] || loginDesc.textContent;
    const pwdInput = q('#admin-password');
    if (pwdInput) pwdInput.placeholder = tr.admin_login_pwd_ph || pwdInput.placeholder;
    const loginBtn = q('#login-form button[type="submit"][data-i18n]');
    if (loginBtn) loginBtn.textContent = tr.admin_login_btn || loginBtn.textContent;
    const backStoreLogin = q('#login-overlay a[data-i18n]');
    if (backStoreLogin) backStoreLogin.textContent = tr.admin_back_store || backStoreLogin.textContent;

    // Sidebar nav buttons (data-i18n driven — handle nav-badge inside them)
    qAll('.sidebar-nav .nav-btn[data-i18n]').forEach(btn => {
      const key = btn.getAttribute('data-i18n');
      if (!tr[key]) return;
      const badge = btn.querySelector('.nav-badge');
      const badgeClone = badge ? badge.cloneNode(true) : null;
      btn.textContent = tr[key];
      if (badgeClone) btn.appendChild(badgeClone);
    });

    // Sidebar role badge
    const sidebarRole = q('.badge-role[data-i18n]');
    if (sidebarRole) sidebarRole.textContent = tr.admin_sidebar_role || sidebarRole.textContent;

    // Logout & back buttons
    const logoutBtn = q('#btn-logout[data-i18n]');
    if (logoutBtn) logoutBtn.textContent = tr.admin_logout || logoutBtn.textContent;
    const backSidebar = q('.btn-back-store-sidebar[data-i18n]');
    if (backSidebar) backSidebar.textContent = tr.admin_back_store_sidebar || tr.admin_back_store || backSidebar.textContent;

    // Table column headers (all data-i18n driven)
    qAll('thead th[data-i18n]').forEach(th => {
      const key = th.getAttribute('data-i18n');
      if (tr[key]) th.textContent = tr[key];
    });

    // Filter bar buttons (data-i18n driven)
    qAll('.filter-btn[data-i18n]').forEach(btn => {
      const key = btn.getAttribute('data-i18n');
      if (tr[key]) btn.textContent = tr[key];
    });

    // Stats cards (data-i18n driven — already handled by generic [data-i18n] loop above but double-ensure)
    qAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (tr[key] !== undefined && el.children.length === 0) {
        el.textContent = tr[key];
      }
    });

    // Pagination controls
    const prevPageBtn = q('#btn-prev-page');
    if (prevPageBtn) prevPageBtn.textContent = (tr.admin_pagination_prev || 'السابق') + ' ←';
    const nextPageBtn = q('#btn-next-page');
    if (nextPageBtn) nextPageBtn.textContent = (tr.admin_pagination_next || 'التالي') + ' →';

    // Product form labels & placeholders
    const formTitle = q('#panel-add-product .form-container h2');
    if (formTitle && !formTitle.dataset.editing) formTitle.textContent = tr.admin_form_add_title || formTitle.textContent;
    const formDesc = q('#panel-add-product .form-container > p');
    if (formDesc) formDesc.textContent = tr.admin_form_add_desc || formDesc.textContent;

    const labelMap = {
      'prod-name': 'admin_form_prod_name',
      'prod-sub': 'admin_form_prod_sub',
      'prod-price': 'admin_form_prod_price',
      'prod-badge': 'admin_form_prod_badge',
      'prod-stars': 'admin_form_prod_stars',
      'prod-reviews': 'admin_form_prod_reviews',
      'prod-stock': 'admin_form_prod_stock',
      'prod-img': 'admin_form_prod_img',
      'prod-colors': 'admin_form_prod_colors',
      'prod-has-colors': 'admin_form_prod_colors_chk'
    };
    Object.entries(labelMap).forEach(([forAttr, tKey]) => {
      const lbl = q(`label[for="${forAttr}"]`);
      if (lbl && tr[tKey]) lbl.textContent = tr[tKey];
    });
    const prodNamePh = q('#prod-name'); if (prodNamePh && tr.admin_form_prod_name_ph) prodNamePh.placeholder = tr.admin_form_prod_name_ph;
    const prodSubPh = q('#prod-sub'); if (prodSubPh && tr.admin_form_prod_sub_ph) prodSubPh.placeholder = tr.admin_form_prod_sub_ph;
    const prodImgPh = q('#prod-img'); if (prodImgPh && tr.admin_form_prod_img_ph) prodImgPh.placeholder = tr.admin_form_prod_img_ph;
    const prodColorsPh = q('#prod-colors'); if (prodColorsPh && tr.admin_form_prod_colors_ph) prodColorsPh.placeholder = tr.admin_form_prod_colors_ph;
    const badgeNoneOpt = q('#prod-badge option[value=""]'); if (badgeNoneOpt && tr.admin_form_badge_none) badgeNoneOpt.textContent = tr.admin_form_badge_none;

    const prodImgHelp = q('#prod-img ~ .help-text'); if (prodImgHelp && tr.admin_form_prod_img_help) prodImgHelp.textContent = tr.admin_form_prod_img_help;
    const prodColorsHelp = q('#prod-colors ~ .help-text'); if (prodColorsHelp && tr.admin_form_prod_colors_help) prodColorsHelp.textContent = tr.admin_form_prod_colors_help;

    const sizesLabel = q('label[for="prod-sizes"], .form-group label[for]');
    const prodSizesLbl = q('#panel-add-product .form-group:has([name="prod-sizes"]) > label');
    if (prodSizesLbl && tr.admin_form_prod_sizes) prodSizesLbl.textContent = tr.admin_form_prod_sizes;

    const saveProdBtn = q('#add-product-form button[type="submit"]');
    if (saveProdBtn && !saveProdBtn.dataset.editing && tr.admin_form_btn_save) saveProdBtn.textContent = tr.admin_form_btn_save;
    const resetProdBtn = q('#add-product-form button[type="reset"]');
    if (resetProdBtn && tr.admin_form_btn_reset) resetProdBtn.textContent = tr.admin_form_btn_reset;

    // Products list header
    const productsListH2 = q('.products-list-header h2');
    if (productsListH2 && tr.admin_products_title) productsListH2.textContent = tr.admin_products_title;
    const productsListP = q('.products-list-header p');
    if (productsListP && tr.admin_products_desc) productsListP.textContent = tr.admin_products_desc;

    // Leads section header
    const leadsH2 = q('.leads-header h2');
    if (leadsH2 && tr.admin_leads_title) leadsH2.textContent = tr.admin_leads_title;
    const leadsP = q('.leads-header p');
    if (leadsP && tr.admin_leads_desc) leadsP.textContent = tr.admin_leads_desc;
    const leadsTotalLabel = q('.leads-mini-card:first-child .leads-mini-label');
    if (leadsTotalLabel && tr.admin_leads_total_label) leadsTotalLabel.textContent = tr.admin_leads_total_label;
    const leadsLatestLabel = q('.leads-mini-card:last-child .leads-mini-label');
    if (leadsLatestLabel && tr.admin_leads_latest_label) leadsLatestLabel.textContent = tr.admin_leads_latest_label;

    // Recent orders header
    const recentBox = q('.recent-box h2[data-i18n]');
    if (recentBox && tr[recentBox.getAttribute('data-i18n')]) recentBox.textContent = tr[recentBox.getAttribute('data-i18n')];

    // Custom modal title
    const customModalTitle = q('#custom-modal-title');
    if (customModalTitle && tr.admin_order_spec_title) customModalTitle.textContent = tr.admin_order_spec_title;
  }

  // 19. Custom Order page specific translations
  const layersTitle = q('#co-layers-section .co-section-title');
  if (layersTitle) {
    const countEl = q('#co-layers-count');
    const countVal = countEl ? countEl.textContent : '0';
    layersTitle.innerHTML = `${tr.co_active_designs || 'Mes Designs Actifs'} (<span id="co-layers-count">${countVal}</span>)`;
  }
  const provSelect = q('#co-province');
  if (provSelect) {
    const placeholderOpt = provSelect.querySelector('option[value=""]');
    if (placeholderOpt) {
      placeholderOpt.textContent = lang === 'ar' ? 'اختر الولاية...' : lang === 'fr' ? 'Choisir la wilaya...' : 'Choose wilaya...';
    }
  }
}

// ═══════════════════════════════════════════
// INITIALIZE LANGUAGE ON PAGE LOAD
// ═══════════════════════════════════════════
function createLanguageModal() {
  if (document.querySelector('#lang-modal')) return;

  const modalMarkup = `
    <div class="lang-modal-backdrop" id="lang-modal-backdrop" aria-hidden="true"></div>
    <div class="lang-modal" id="lang-modal" role="dialog" aria-modal="true" aria-labelledby="lang-modal-title">
      <div class="lang-modal__handle"></div>
      <div class="lang-modal__header">
        <span class="lang-modal__title" id="lang-modal-title" data-i18n="lang_modal_title">Choose Language</span>
        <button class="lang-modal__close" id="lang-modal-close" aria-label="Close language selector">&times;</button>
      </div>
      <div class="lang-modal__list">
        <button class="lang-modal__option" data-lang="ar">
          <span class="lang-modal__flag">🇩🇿</span>
          <div class="lang-modal__info">
            <span class="lang-modal__name">Arabic</span>
            <span class="lang-modal__native">عربي - العربية</span>
          </div>
          <span class="lang-modal__check">✓</span>
        </button>
        <button class="lang-modal__option" data-lang="fr">
          <span class="lang-modal__flag">🇫🇷</span>
          <div class="lang-modal__info">
            <span class="lang-modal__name">Français</span>
            <span class="lang-modal__native">Langue française</span>
          </div>
          <span class="lang-modal__check">✓</span>
        </button>
        <button class="lang-modal__option" data-lang="en">
          <span class="lang-modal__flag">🇺🇸</span>
          <div class="lang-modal__info">
            <span class="lang-modal__name">English</span>
            <span class="lang-modal__native">English language</span>
          </div>
          <span class="lang-modal__check">✓</span>
        </button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalMarkup);
}

function openLanguageModal() {
  const backdrop = document.querySelector('#lang-modal-backdrop');
  const modal = document.querySelector('#lang-modal');
  if (!backdrop || !modal) return;
  backdrop.classList.add('open');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLanguageModal() {
  const backdrop = document.querySelector('#lang-modal-backdrop');
  const modal = document.querySelector('#lang-modal');
  if (!backdrop || !modal) return;
  backdrop.classList.remove('open');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function refreshLanguageModalState(lang) {
  document.querySelectorAll('.lang-modal__option').forEach(option => {
    const isActive = option.dataset.lang === lang;
    option.classList.toggle('active', isActive);
  });
}

function openLanguageSelector(event) {
  event.preventDefault();
  event.stopPropagation();
  document.querySelectorAll('.lang-dropdown.active').forEach(d => d.classList.remove('active'));
  document.querySelectorAll('.lang-selector.dropdown-open').forEach(s => s.classList.remove('dropdown-open'));
  createLanguageModal();
  openLanguageModal();
}

document.addEventListener('DOMContentLoaded', () => {
  createLanguageModal();

  document.body.addEventListener('click', (event) => {
    const modalOption = event.target.closest('.lang-modal__option');
    if (modalOption) {
      event.preventDefault();
      event.stopPropagation();
      const lang = modalOption.dataset.lang;
      if (lang && window.setLanguage) {
        window.setLanguage(lang);
      }
      closeLanguageModal();
      return;
    }

    const langBtn = event.target.closest('.lang-btn');
    if (langBtn) {
      event.preventDefault();
      event.stopPropagation();
      openLanguageSelector(event);
      return;
    }

    const sideDrawerLangBtn = event.target.closest('#side-drawer-lang-btn');
    if (sideDrawerLangBtn) {
      event.preventDefault();
      event.stopPropagation();
      openLanguageSelector(event);
      return;
    }

    const modalClose = event.target.closest('#lang-modal-close');
    const modalBackdrop = event.target.closest('#lang-modal-backdrop');
    if (modalClose || modalBackdrop) {
      event.preventDefault();
      event.stopPropagation();
      closeLanguageModal();
      return;
    }

    // Close any legacy dropdowns if user clicks outside.
    document.querySelectorAll('.lang-dropdown.active').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('.lang-selector.dropdown-open').forEach(s => s.classList.remove('dropdown-open'));
  });

  // Initialize: read saved language or default to French
  const savedLang = localStorage.getItem('aizo_lang') || 'fr';
  window.setLanguage(savedLang);
});
