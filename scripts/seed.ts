import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI!;

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // Clear existing data
  const db = mongoose.connection.db!;
  await db.dropDatabase();
  console.log("Database cleared");

  // ---- Admin ----
  const Admin = mongoose.model("Admin", new mongoose.Schema({
    email: String, password: String, name: String, role: String,
  }, { timestamps: true }));

  await Admin.create({
    email: "admin@nutracare360.ca",
    password: await bcrypt.hash("AdminNC360!", 12),
    name: "NutraCare360 Admin",
    role: "superadmin",
  });
  console.log("Admin created");

  // ---- Practitioners ----
  const PractitionerSchema = new mongoose.Schema({
    name: String, slug: String, profileImage: String, coverImage: String,
    practiceType: String, businessName: String, designation: String,
    clinicDetails: Object, googleBusinessProfileUrl: String,
    categories: [String], address: Object, coordinates: Object,
    phone: String, email: String, website: String, social: Object,
    bio: String, shortBio: String, experience: Number,
    education: Array, certifications: Array, languages: [String],
    services: Array, workingHours: Object, gallery: [String],
    rating: Number, reviewCount: Number, status: String,
    listingType: String, isFeatured: Boolean, isVerified: Boolean,
    metaTitle: String, metaDescription: String, approvedAt: Date,
  }, { timestamps: true });

  const Practitioner = mongoose.model("Practitioner", PractitionerSchema);

  const practitioners = [
    {
      name: "Dr. Priya Sharma",
      slug: "dr-priya-sharma-toronto",
      profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
      coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200",
      businessName: "Ayurveda Wellness Centre",
      designation: "Registered Ayurvedic Practitioner, B.A.M.S.",
      categories: ["Ayurveda", "Nutritionist", "Herbal Medicine"],
      address: { street: "123 Bloor Street West", city: "Toronto", province: "Ontario", postalCode: "M5S 1W7", country: "Canada" },
      phone: "+1 (416) 555-0123",
      email: "drpriya@ayurvedacentre.ca",
      website: "https://ayurvedacentre.ca",
      bio: "Dr. Priya Sharma brings 15 years of Ayurvedic expertise from India and Canada. Specialising in chronic disease management, digestive health, and stress-related disorders using traditional Ayurvedic principles combined with modern nutritional science.",
      shortBio: "15 years Ayurvedic expertise. Specialising in chronic disease and digestive health.",
      experience: 15,
      languages: ["English", "Hindi", "Punjabi"],
      services: [
        { name: "Initial Ayurvedic Consultation", duration: "90 min", price: "CAD $180", description: "Comprehensive dosha analysis and personalised treatment plan" },
        { name: "Follow-up Consultation", duration: "45 min", price: "CAD $90", description: "Progress review and treatment adjustment" },
        { name: "Panchakarma Consultation", duration: "60 min", price: "CAD $120", description: "Detox and cleansing therapy planning" },
      ],
      workingHours: {
        monday: { open: "9:00 AM", close: "6:00 PM", isClosed: false },
        tuesday: { open: "9:00 AM", close: "6:00 PM", isClosed: false },
        wednesday: { open: "10:00 AM", close: "7:00 PM", isClosed: false },
        thursday: { open: "9:00 AM", close: "6:00 PM", isClosed: false },
        friday: { open: "9:00 AM", close: "5:00 PM", isClosed: false },
        saturday: { open: "10:00 AM", close: "3:00 PM", isClosed: false },
        sunday: { open: "", close: "", isClosed: true },
      },
      rating: 4.9, reviewCount: 87, status: "approved", listingType: "free", isFeatured: true, isVerified: true,
      approvedAt: new Date(),
    },
    {
      name: "Michael Chen",
      slug: "michael-chen-vancouver",
      profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
      coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
      businessName: "Pacific Acupuncture & TCM",
      designation: "Registered Acupuncturist (R.Ac), TCM Practitioner",
      categories: ["Acupuncture", "Traditional Chinese Medicine", "Cupping Therapy"],
      address: { street: "456 Granville Street", city: "Vancouver", province: "British Columbia", postalCode: "V6C 1T2", country: "Canada" },
      phone: "+1 (604) 555-0189",
      email: "mchen@pacifictcm.ca",
      bio: "Michael Chen is a third-generation TCM practitioner with training from Beijing University of Chinese Medicine and the Canadian College of Traditional Chinese Medicine. Expert in pain management, fertility support, and mental health.",
      shortBio: "3rd generation TCM practitioner. Expert in pain management and fertility.",
      experience: 12,
      languages: ["English", "Mandarin", "Cantonese"],
      services: [
        { name: "Acupuncture Session", duration: "60 min", price: "CAD $110", description: "Full acupuncture treatment with TCM diagnosis" },
        { name: "Cupping Therapy", duration: "45 min", price: "CAD $85", description: "Traditional fire or vacuum cupping" },
        { name: "Herbal Consultation", duration: "30 min", price: "CAD $65", description: "Custom herbal formula prescription" },
      ],
      workingHours: {
        monday: { open: "8:00 AM", close: "5:00 PM", isClosed: false },
        tuesday: { open: "8:00 AM", close: "5:00 PM", isClosed: false },
        wednesday: { open: "8:00 AM", close: "5:00 PM", isClosed: false },
        thursday: { open: "8:00 AM", close: "7:00 PM", isClosed: false },
        friday: { open: "8:00 AM", close: "5:00 PM", isClosed: false },
        saturday: { open: "9:00 AM", close: "2:00 PM", isClosed: false },
        sunday: { open: "", close: "", isClosed: true },
      },
      rating: 4.8, reviewCount: 134, status: "approved", listingType: "free", isFeatured: true, isVerified: true,
      approvedAt: new Date(),
    },
    {
      name: "Sarah Thompson",
      slug: "sarah-thompson-calgary",
      profileImage: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400",
      coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200",
      businessName: "Calgary Naturopathic Clinic",
      designation: "Naturopathic Doctor (ND)",
      categories: ["Naturopathy", "Nutritionist", "IV Nutrient Therapy", "Hormone Therapy"],
      address: { street: "789 17th Avenue SW", city: "Calgary", province: "Alberta", postalCode: "T2T 0B7", country: "Canada" },
      phone: "+1 (403) 555-0234",
      email: "sthompson@calgarynd.ca",
      bio: "Dr. Sarah Thompson is a licensed Naturopathic Doctor focusing on women's health, hormone balancing, and chronic fatigue. She combines evidence-based naturopathic medicine with functional nutrition to create personalised healing protocols.",
      shortBio: "ND specialising in women's health and hormone balancing.",
      experience: 8,
      languages: ["English", "French"],
      services: [
        { name: "New Patient Consultation", duration: "75 min", price: "CAD $200", description: "Comprehensive health intake and treatment planning" },
        { name: "IV Vitamin Therapy", duration: "60 min", price: "CAD $150-250", description: "Custom IV nutrient infusion" },
        { name: "Hormone Assessment", duration: "60 min", price: "CAD $175", description: "DUTCH hormone testing and interpretation" },
      ],
      workingHours: {
        monday: { open: "9:00 AM", close: "5:00 PM", isClosed: false },
        tuesday: { open: "9:00 AM", close: "7:00 PM", isClosed: false },
        wednesday: { open: "9:00 AM", close: "5:00 PM", isClosed: false },
        thursday: { open: "9:00 AM", close: "7:00 PM", isClosed: false },
        friday: { open: "9:00 AM", close: "4:00 PM", isClosed: false },
        saturday: { open: "", close: "", isClosed: true },
        sunday: { open: "", close: "", isClosed: true },
      },
      rating: 4.7, reviewCount: 62, status: "approved", listingType: "free", isFeatured: false, isVerified: true,
      approvedAt: new Date(),
    },
    {
      name: "Amara Diallo",
      slug: "amara-diallo-ottawa",
      profileImage: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400",
      coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
      businessName: "Harmony Reiki & Energy Healing",
      designation: "Usui Reiki Master Teacher, Certified Energy Healer",
      categories: ["Reiki", "Aura Soma", "Aromatherapy"],
      address: { street: "321 Bank Street", city: "Ottawa", province: "Ontario", postalCode: "K2P 1X7", country: "Canada" },
      phone: "+1 (613) 555-0345",
      email: "amara@harmonyreiki.ca",
      bio: "Amara Diallo is a Reiki Master Teacher with over 10 years of experience helping clients release energetic blocks, reduce stress, and reconnect with their inner wellness. Also trained in Aura Soma colour therapy and clinical aromatherapy.",
      shortBio: "Reiki Master Teacher with 10+ years helping clients release stress and energetic blocks.",
      experience: 10,
      languages: ["English", "French"],
      services: [
        { name: "Reiki Session", duration: "60 min", price: "CAD $95", description: "Hands-on or distance Reiki healing" },
        { name: "Aura Soma Consultation", duration: "45 min", price: "CAD $75", description: "Colour bottle reading and energy profile" },
        { name: "Aromatherapy Session", duration: "60 min", price: "CAD $90", description: "Custom essential oil blend and treatment" },
      ],
      workingHours: {
        monday: { open: "", close: "", isClosed: true },
        tuesday: { open: "10:00 AM", close: "7:00 PM", isClosed: false },
        wednesday: { open: "10:00 AM", close: "7:00 PM", isClosed: false },
        thursday: { open: "10:00 AM", close: "7:00 PM", isClosed: false },
        friday: { open: "10:00 AM", close: "6:00 PM", isClosed: false },
        saturday: { open: "9:00 AM", close: "4:00 PM", isClosed: false },
        sunday: { open: "11:00 AM", close: "3:00 PM", isClosed: false },
      },
      rating: 4.9, reviewCount: 51, status: "approved", listingType: "free", isFeatured: false, isVerified: false,
      approvedAt: new Date(),
    },
    {
      name: "James MacKinnon",
      slug: "james-mackinnon-edmonton",
      profileImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
      coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200",
      businessName: "Alberta Chiropractic & Wellness",
      designation: "Doctor of Chiropractic (DC)",
      categories: ["Chiropractor", "Physiotherapy", "Body Movement Therapies"],
      address: { street: "567 Jasper Avenue", city: "Edmonton", province: "Alberta", postalCode: "T5J 3S2", country: "Canada" },
      phone: "+1 (780) 555-0456",
      email: "jmackinnon@albertachiro.ca",
      bio: "Dr. James MacKinnon has been serving Edmonton's community for 14 years with comprehensive chiropractic care. Specialising in sports injuries, postural correction, and chronic back pain, he uses a holistic approach combining chiropractic adjustments with rehabilitative exercise.",
      shortBio: "14 years serving Edmonton. Sports injuries, posture, and chronic pain specialist.",
      experience: 14,
      languages: ["English"],
      services: [
        { name: "Initial Chiropractic Assessment", duration: "60 min", price: "CAD $120", description: "Full spinal assessment and x-ray review" },
        { name: "Chiropractic Adjustment", duration: "30 min", price: "CAD $75", description: "Spinal manipulation and mobilisation" },
        { name: "Sports Injury Treatment", duration: "45 min", price: "CAD $95", description: "Active release + adjustment + rehab exercises" },
      ],
      workingHours: {
        monday: { open: "8:00 AM", close: "6:00 PM", isClosed: false },
        tuesday: { open: "8:00 AM", close: "6:00 PM", isClosed: false },
        wednesday: { open: "8:00 AM", close: "6:00 PM", isClosed: false },
        thursday: { open: "8:00 AM", close: "6:00 PM", isClosed: false },
        friday: { open: "8:00 AM", close: "5:00 PM", isClosed: false },
        saturday: { open: "9:00 AM", close: "1:00 PM", isClosed: false },
        sunday: { open: "", close: "", isClosed: true },
      },
      rating: 4.8, reviewCount: 203, status: "approved", listingType: "free", isFeatured: true, isVerified: true,
      approvedAt: new Date(),
    },
    {
      name: "Dr. Leena Patel",
      slug: "dr-leena-patel-mississauga",
      profileImage: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400",
      coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
      businessName: "Holistic Homeopathy Clinic",
      designation: "Classical Homeopath (DHMHS), Registered Nutritionist",
      categories: ["Homeopathy", "Nutritionist", "Detox Programs"],
      address: { street: "890 Hurontario Street", city: "Mississauga", province: "Ontario", postalCode: "L5B 3B5", country: "Canada" },
      phone: "+1 (905) 555-0567",
      email: "drleena@holistichomeopathy.ca",
      bio: "Dr. Leena Patel is a classically trained Homeopath with 18 years of clinical experience. She specialises in childhood health, autoimmune conditions, and hormonal imbalances. Her integrative approach combines constitutional homeopathy with clinical nutrition.",
      shortBio: "18 years of classical homeopathy. Expert in childhood health and autoimmune conditions.",
      experience: 18,
      languages: ["English", "Hindi", "Gujarati"],
      services: [
        { name: "Initial Homeopathic Consultation", duration: "90 min", price: "CAD $195", description: "Full constitutional case-taking" },
        { name: "Children's Consultation", duration: "60 min", price: "CAD $145", description: "Paediatric homeopathic assessment" },
        { name: "Nutritional Assessment", duration: "60 min", price: "CAD $130", description: "Dietary analysis and supplement planning" },
      ],
      workingHours: {
        monday: { open: "10:00 AM", close: "7:00 PM", isClosed: false },
        tuesday: { open: "10:00 AM", close: "7:00 PM", isClosed: false },
        wednesday: { open: "", close: "", isClosed: true },
        thursday: { open: "10:00 AM", close: "7:00 PM", isClosed: false },
        friday: { open: "10:00 AM", close: "5:00 PM", isClosed: false },
        saturday: { open: "10:00 AM", close: "3:00 PM", isClosed: false },
        sunday: { open: "", close: "", isClosed: true },
      },
      rating: 4.9, reviewCount: 118, status: "approved", listingType: "free", isFeatured: false, isVerified: true,
      approvedAt: new Date(),
    },
    {
      name: "Fatima Al-Hassan",
      slug: "fatima-al-hassan-winnipeg",
      profileImage: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400",
      coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
      businessName: "Prairie Yoga & Mindfulness Studio",
      designation: "Certified Yoga Therapist (C-IAYT), Qigong Instructor",
      categories: ["Yoga Therapy", "Qigong", "Psychotherapy"],
      address: { street: "234 Portage Avenue", city: "Winnipeg", province: "Manitoba", postalCode: "R3C 0B5", country: "Canada" },
      phone: "+1 (204) 555-0678",
      email: "fatima@prairieyoga.ca",
      bio: "Fatima Al-Hassan is a certified Yoga Therapist and Qigong instructor with training from the International Association of Yoga Therapists. She specialises in trauma-sensitive yoga, anxiety management, and energy cultivation practices for all ages.",
      shortBio: "Yoga Therapist & Qigong instructor. Trauma-sensitive approach for anxiety and stress.",
      experience: 9,
      languages: ["English", "Arabic", "French"],
      services: [
        { name: "Private Yoga Therapy Session", duration: "60 min", price: "CAD $100", description: "Individualised therapeutic yoga program" },
        { name: "Qigong Session", duration: "60 min", price: "CAD $85", description: "Traditional Chinese energy cultivation" },
        { name: "Group Trauma-Sensitive Yoga", duration: "75 min", price: "CAD $35", description: "Small group class (max 8 people)" },
      ],
      workingHours: {
        monday: { open: "7:00 AM", close: "8:00 PM", isClosed: false },
        tuesday: { open: "7:00 AM", close: "8:00 PM", isClosed: false },
        wednesday: { open: "7:00 AM", close: "8:00 PM", isClosed: false },
        thursday: { open: "7:00 AM", close: "8:00 PM", isClosed: false },
        friday: { open: "7:00 AM", close: "6:00 PM", isClosed: false },
        saturday: { open: "8:00 AM", close: "4:00 PM", isClosed: false },
        sunday: { open: "9:00 AM", close: "12:00 PM", isClosed: false },
      },
      rating: 4.7, reviewCount: 76, status: "approved", listingType: "free", isFeatured: false, isVerified: false,
      approvedAt: new Date(),
    },
    {
      name: "Robert Villeneuve",
      slug: "robert-villeneuve-montreal",
      profileImage: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400",
      coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200",
      businessName: "Centre de Réflexologie de Montréal",
      designation: "Certified Reflexologist (RAC), Registered Massage Therapist",
      categories: ["Reflexology", "Hot Stone Massage", "Aromatherapy"],
      address: { street: "1234 Rue Sainte-Catherine", city: "Montreal", province: "Quebec", postalCode: "H3A 1K5", country: "Canada" },
      phone: "+1 (514) 555-0789",
      email: "robert@reflexologiemtl.ca",
      bio: "Robert Villeneuve is a Reflexology Association of Canada certified practitioner with 11 years of experience. He offers traditional foot reflexology, hot stone massage, and aromatherapy in both English and French in the heart of Montreal.",
      shortBio: "RAC certified reflexologist. 11 years experience. English & French services.",
      experience: 11,
      languages: ["English", "French"],
      services: [
        { name: "Foot Reflexology", duration: "60 min", price: "CAD $95", description: "Full foot reflexology treatment" },
        { name: "Hot Stone Massage", duration: "75 min", price: "CAD $130", description: "Therapeutic hot basalt stone massage" },
        { name: "Aromatherapy Massage", duration: "60 min", price: "CAD $110", description: "Custom essential oil massage blend" },
      ],
      workingHours: {
        monday: { open: "11:00 AM", close: "8:00 PM", isClosed: false },
        tuesday: { open: "11:00 AM", close: "8:00 PM", isClosed: false },
        wednesday: { open: "11:00 AM", close: "8:00 PM", isClosed: false },
        thursday: { open: "11:00 AM", close: "8:00 PM", isClosed: false },
        friday: { open: "11:00 AM", close: "7:00 PM", isClosed: false },
        saturday: { open: "10:00 AM", close: "5:00 PM", isClosed: false },
        sunday: { open: "", close: "", isClosed: true },
      },
      rating: 4.6, reviewCount: 89, status: "approved", listingType: "free", isFeatured: false, isVerified: true,
      approvedAt: new Date(),
    },

    // ── Wellness Centre (Toronto) ──
    {
      name: "Rosedale Integrative Wellness Centre",
      slug: "rosedale-integrative-wellness-centre-toronto",
      practiceType: "center",
      coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200",
      clinicDetails: {
        clinicName: "Rosedale Integrative Wellness Centre",
        logo: "https://images.unsplash.com/photo-1563213126-a4273aed2016?w=400",
        establishedYear: 2014,
        totalPractitioners: 7,
        teamMembers: [
          {
            name: "Dr. Nadia Kowalski",
            designation: "Naturopathic Doctor (ND)",
            photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200",
            specialties: ["Hormone Therapy", "Gut Health", "Autoimmune"],
          },
          {
            name: "Marcus Rivera",
            designation: "Registered Massage Therapist (RMT)",
            photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200",
            specialties: ["Deep Tissue", "Sports Recovery", "Prenatal"],
          },
          {
            name: "Sunita Mehta",
            designation: "Certified Yoga Therapist (C-IAYT)",
            photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200",
            specialties: ["Trauma-Sensitive Yoga", "Breathwork", "Chronic Pain"],
          },
        ],
      },
      googleBusinessProfileUrl: "https://maps.google.com/?cid=123456789",
      categories: ["Naturopathy", "Registered Massage Therapy", "Yoga Therapy", "Nutritionist", "Reiki"],
      address: { street: "88 Rosedale Valley Road", city: "Toronto", province: "Ontario", postalCode: "M4W 1P8", country: "Canada" },
      phone: "+1 (416) 555-0911",
      email: "hello@rosedaleiwc.ca",
      website: "https://rosedaleiwc.ca",
      social: { instagram: "https://instagram.com/rosedaleiwc", facebook: "", linkedin: "", youtube: "" },
      bio: "Rosedale Integrative Wellness Centre has been Toronto's premier multi-therapy destination since 2014. Our team of seven practitioners combines naturopathic medicine, massage therapy, yoga therapy, and energy healing under one roof — so your care is coordinated, not fragmented. We believe wellness is not the absence of disease but the presence of vitality.",
      shortBio: "Toronto's premier multi-therapy centre. 7 practitioners, one coordinated wellness plan.",
      languages: ["English", "French", "Polish", "Hindi"],
      services: [
        { name: "Integrative Wellness Assessment", duration: "90 min", price: "CAD $220", description: "Multi-practitioner intake — includes ND + RMT consultation" },
        { name: "RMT Deep Tissue Massage", duration: "60 min", price: "CAD $130", description: "Therapeutic massage for chronic tension and sports recovery" },
        { name: "Yoga Therapy (Private)", duration: "60 min", price: "CAD $105", description: "Personalised yoga program for your health goals" },
      ],
      workingHours: {
        monday: { open: "8:00 AM", close: "7:00 PM", isClosed: false },
        tuesday: { open: "8:00 AM", close: "7:00 PM", isClosed: false },
        wednesday: { open: "8:00 AM", close: "7:00 PM", isClosed: false },
        thursday: { open: "8:00 AM", close: "8:00 PM", isClosed: false },
        friday: { open: "8:00 AM", close: "6:00 PM", isClosed: false },
        saturday: { open: "9:00 AM", close: "4:00 PM", isClosed: false },
        sunday: { open: "", close: "", isClosed: true },
      },
      rating: 4.9, reviewCount: 211, status: "approved", listingType: "premium", isFeatured: true, isVerified: true,
      approvedAt: new Date(),
    },

    // ── TCM Clinic (Vancouver) ──
    {
      name: "Golden Needle TCM Clinic",
      slug: "golden-needle-tcm-clinic-vancouver",
      practiceType: "clinic",
      coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
      clinicDetails: {
        clinicName: "Golden Needle TCM Clinic",
        logo: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400",
        establishedYear: 2009,
        totalPractitioners: 4,
        teamMembers: [
          {
            name: "Dr. Wei-Lin Zhou",
            designation: "Doctor of TCM, R.Ac, R.TCMP",
            photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200",
            specialties: ["Fertility Acupuncture", "Oncology Support", "Pain Management"],
          },
          {
            name: "Jennifer Nakamura",
            designation: "Registered Acupuncturist (R.Ac)",
            photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200",
            specialties: ["Mental Health", "Cosmetic Acupuncture", "Digestive Disorders"],
          },
        ],
      },
      googleBusinessProfileUrl: "https://maps.google.com/?cid=987654321",
      categories: ["Acupuncture", "Traditional Chinese Medicine", "Cupping Therapy", "Herbal Medicine", "Moxibustion"],
      address: { street: "318 West Hastings Street", city: "Vancouver", province: "British Columbia", postalCode: "V6B 1L2", country: "Canada" },
      phone: "+1 (604) 555-0822",
      email: "info@goldenneedletcm.ca",
      website: "https://goldenneedletcm.ca",
      social: { instagram: "https://instagram.com/goldenneedletcm", facebook: "https://facebook.com/goldenneedletcm", linkedin: "", youtube: "" },
      bio: "Golden Needle TCM Clinic has served Vancouver's diverse community for over 15 years. Our team of registered acupuncturists and TCM practitioners specialise in fertility support, chronic pain, mental health, and oncology acupuncture. We hold the highest credentials from the College of Traditional Chinese Medicine Practitioners and Acupuncturists of BC (CTCMA) and offer treatments in English, Mandarin, and Japanese.",
      shortBio: "15+ years in Vancouver. CTCMA-registered TCM clinic specialising in fertility, pain, and mental health.",
      languages: ["English", "Mandarin", "Cantonese", "Japanese"],
      services: [
        { name: "Acupuncture & TCM Assessment", duration: "75 min", price: "CAD $145", description: "Full TCM diagnosis + first acupuncture treatment" },
        { name: "Follow-up Acupuncture", duration: "50 min", price: "CAD $105", description: "Ongoing acupuncture treatment" },
        { name: "Cupping + Gua Sha", duration: "45 min", price: "CAD $90", description: "Traditional cupping and gua sha for pain and circulation" },
        { name: "Custom Herbal Formula", duration: "30 min", price: "CAD $70", description: "TCM herbal prescription, dispensed in-clinic" },
      ],
      workingHours: {
        monday: { open: "9:00 AM", close: "6:00 PM", isClosed: false },
        tuesday: { open: "9:00 AM", close: "6:00 PM", isClosed: false },
        wednesday: { open: "9:00 AM", close: "7:00 PM", isClosed: false },
        thursday: { open: "9:00 AM", close: "7:00 PM", isClosed: false },
        friday: { open: "9:00 AM", close: "6:00 PM", isClosed: false },
        saturday: { open: "10:00 AM", close: "3:00 PM", isClosed: false },
        sunday: { open: "", close: "", isClosed: true },
      },
      rating: 4.8, reviewCount: 176, status: "approved", listingType: "premium", isFeatured: true, isVerified: true,
      approvedAt: new Date(),
    },
  ];

  await Practitioner.insertMany(practitioners);
  console.log("10 practitioners seeded");

  // ---- Blogs ----
  const BlogSchema = new mongoose.Schema({
    title: String, slug: String, excerpt: String, content: String,
    coverImage: String, category: String, tags: [String],
    author: Object, isAIGenerated: Boolean, isPublished: Boolean,
    publishedAt: Date, readTime: Number,
  }, { timestamps: true });

  const Blog = mongoose.model("Blog", BlogSchema);

  const blogs = [
    {
      title: "The Ancient Wisdom of Ayurveda: How India's 5,000-Year-Old System Can Transform Your Health in Canada",
      slug: "ayurveda-ancient-wisdom-canada",
      excerpt: "Discover how Ayurveda's timeless principles of doshas, daily routines, and herbal medicine are helping Canadians achieve vibrant health and balance.",
      coverImage: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",
      category: "Ayurveda",
      tags: ["Ayurveda", "Holistic Health", "Natural Medicine", "Canada"],
      author: { name: "NutraCare360 Editorial", avatar: "", bio: "AI-assisted content by the NutraCare360 team" },
      isAIGenerated: true,
      isPublished: true,
      publishedAt: new Date("2025-01-15"),
      readTime: 7,
      content: `<h2>What Is Ayurveda?</h2>
<p>Ayurveda, meaning "the science of life" in Sanskrit, is one of the world's oldest holistic healing systems, originating in India over 5,000 years ago. Unlike conventional Western medicine, which primarily focuses on treating disease, Ayurveda emphasises the prevention of illness and the promotion of optimal wellness through balance of mind, body, and spirit.</p>
<h2>The Three Doshas: Your Unique Blueprint</h2>
<p>At the heart of Ayurvedic philosophy are the three doshas — Vata, Pitta, and Kapha — which represent different combinations of the five elements (earth, water, fire, air, and space). Each person has a unique combination of these doshas, called their <em>prakriti</em> or constitutional type.</p>
<ul>
<li><strong>Vata</strong> (air + space): Governs movement, creativity, and communication</li>
<li><strong>Pitta</strong> (fire + water): Governs digestion, metabolism, and transformation</li>
<li><strong>Kapha</strong> (earth + water): Governs structure, stability, and lubrication</li>
</ul>
<h2>Ayurveda in the Canadian Context</h2>
<p>Canada's diverse and multicultural population has embraced Ayurveda as a complementary approach to healthcare. Many Canadians are turning to registered Ayurvedic practitioners to address chronic conditions such as digestive disorders, anxiety, insomnia, and hormonal imbalances that conventional medicine hasn't fully resolved.</p>
<h2>What to Expect in Your First Consultation</h2>
<p>A first Ayurvedic consultation typically lasts 60–90 minutes. Your practitioner will assess your prakriti (constitutional type) through pulse diagnosis, tongue examination, and a detailed health history. You'll receive a personalised plan that may include dietary recommendations, herbal formulas, lifestyle modifications, yoga and pranayama practices, and Panchakarma (detox) therapies.</p>
<h2>Finding a Qualified Ayurvedic Practitioner in Canada</h2>
<p>When seeking an Ayurvedic practitioner in Canada, look for credentials such as B.A.M.S. (Bachelor of Ayurvedic Medicine and Surgery) or certification from recognised Canadian or international Ayurvedic institutions. Practitioners should ideally be registered with a provincial body or the Canadian Ayurvedic Practitioners Association (CAPA).</p>`,
    },
    {
      title: "Acupuncture in Canada: What the Research Says and How to Find a Registered Acupuncturist Near You",
      slug: "acupuncture-canada-research-guide",
      excerpt: "Evidence-based overview of acupuncture research in Canada, how R.Ac registration works, and what to expect in your first session.",
      coverImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800",
      category: "Acupuncture",
      tags: ["Acupuncture", "TCM", "Pain Management", "Canada", "R.Ac"],
      author: { name: "NutraCare360 Editorial", avatar: "", bio: "AI-assisted content by the NutraCare360 team" },
      isAIGenerated: true,
      isPublished: true,
      publishedAt: new Date("2025-01-22"),
      readTime: 6,
      content: `<h2>What Does the Research Say?</h2>
<p>Acupuncture has been the subject of thousands of clinical studies over the past three decades. Health Canada and major medical institutions now acknowledge acupuncture as an evidence-based treatment for chronic pain, headaches, nausea, and several other conditions. The World Health Organization (WHO) recognises acupuncture as effective for over 40 health conditions.</p>
<h2>How Acupuncture Works</h2>
<p>Traditional Chinese Medicine theory explains acupuncture through the concept of Qi (vital energy) flowing through meridians. Modern scientific research suggests that acupuncture stimulates the nervous system, releases endorphins, reduces inflammation, and improves blood circulation — all of which contribute to its therapeutic effects.</p>
<h2>Acupuncturist Registration in Canada</h2>
<p>In Canada, acupuncture regulation varies by province. In Ontario, acupuncturists are regulated by the College of Traditional Chinese Medicine Practitioners and Acupuncturists of Ontario (CTCMPAO). In British Columbia, they are regulated by the College of Traditional Chinese Medicine Practitioners and Acupuncturists of BC (CTCMA). Always verify that your practitioner holds a valid provincial registration.</p>
<h2>What to Expect in Your First Session</h2>
<p>Your first appointment will include a thorough health assessment (60–90 minutes). The practitioner will ask about your chief complaint, overall health, diet, sleep, and emotional wellbeing. Needles are hair-thin and most patients feel minimal discomfort — many report a pleasant sensation of warmth or heaviness. Sessions typically last 45–60 minutes.</p>`,
    },
    {
      title: "Naturopathic Medicine vs. Conventional Medicine: Understanding the Integrative Approach to Health",
      slug: "naturopathic-vs-conventional-medicine-canada",
      excerpt: "Learn how Naturopathic Doctors differ from MDs in Canada, how they work together, and what conditions naturopathy helps most.",
      coverImage: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=800",
      category: "Naturopathy",
      tags: ["Naturopathy", "ND", "Integrative Medicine", "Canada", "Women's Health"],
      author: { name: "NutraCare360 Editorial", avatar: "", bio: "AI-assisted content by the NutraCare360 team" },
      isAIGenerated: true,
      isPublished: true,
      publishedAt: new Date("2025-01-29"),
      readTime: 8,
      content: `<h2>What Is a Naturopathic Doctor?</h2>
<p>Naturopathic Doctors (NDs) in Canada complete a four-year, post-graduate naturopathic medical program following an undergraduate degree. They are trained in clinical nutrition, botanical medicine, homeopathy, acupuncture, physical medicine, and lifestyle counselling. NDs are regulated in most Canadian provinces.</p>
<h2>How NDs and MDs Differ</h2>
<p>While Medical Doctors (MDs) focus primarily on diagnosing and treating disease — often with pharmaceutical interventions — Naturopathic Doctors emphasise identifying and treating root causes of illness, supporting the body's natural healing abilities, and preventing disease through lifestyle optimisation.</p>
<h2>The Integrative Approach</h2>
<p>Increasingly, NDs and MDs are working together in integrative health clinics across Canada. This collaborative model allows patients to benefit from both pharmaceutical interventions when necessary and natural, lifestyle-based approaches for long-term wellness. Many NDs in Canada co-manage patients with their family physicians.</p>
<h2>What Does Naturopathy Help Most?</h2>
<ul>
<li>Hormonal imbalances and thyroid disorders</li>
<li>Digestive issues (IBS, Crohn's, food sensitivities)</li>
<li>Chronic fatigue and fibromyalgia</li>
<li>Mental health (anxiety, depression)</li>
<li>Skin conditions (eczema, acne, psoriasis)</li>
<li>Fertility and reproductive health</li>
</ul>
<h2>Insurance Coverage in Canada</h2>
<p>Many extended health insurance plans in Canada cover naturopathic visits, though coverage amounts vary. Check with your insurance provider for your specific coverage. Some provincial governments also offer limited coverage through certain programs.</p>`,
    },
    {
      title: "Reflexology 101: How Pressure Points on Your Feet Can Heal Your Entire Body",
      slug: "reflexology-101-pressure-points-guide",
      excerpt: "Discover how foot reflexology works, what conditions it addresses, and how to find a RAC-certified reflexologist near you.",
      coverImage: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800",
      category: "Reflexology",
      tags: ["Reflexology", "Foot Therapy", "Stress Relief", "Holistic Health"],
      author: { name: "NutraCare360 Editorial", avatar: "", bio: "AI-assisted content by the NutraCare360 team" },
      isAIGenerated: true,
      isPublished: true,
      publishedAt: new Date("2025-02-05"),
      readTime: 5,
      content: `<h2>What Is Reflexology?</h2>
<p>Reflexology is a non-invasive complementary therapy based on the principle that different points on the feet, hands, and ears correspond to different organs, glands, and systems of the body. By applying targeted pressure to these reflex points, practitioners aim to promote relaxation, improve circulation, and support the body's natural healing processes.</p>
<h2>The Foot Reflex Map</h2>
<p>Each foot is divided into zones that correspond to different areas of the body. The toes represent the head and neck, the ball of the foot corresponds to the chest and lungs, the arch relates to digestive organs and kidneys, and the heel area connects to the pelvic region and lower back. A skilled reflexologist can "read" the feet to assess areas of tension or imbalance.</p>
<h2>What Conditions Does Reflexology Address?</h2>
<ul>
<li>Stress and anxiety reduction</li>
<li>Headaches and migraines</li>
<li>Digestive disorders</li>
<li>Sleep problems and insomnia</li>
<li>PMS and hormonal imbalances</li>
<li>Back pain and tension</li>
<li>Circulatory issues</li>
</ul>
<h2>What to Expect in a Session</h2>
<p>A reflexology session typically lasts 45–60 minutes. You remain fully clothed except for removing shoes and socks. The reflexologist will apply gentle to firm pressure using thumbs, fingers, and hands to work through the reflex points. Most people find it deeply relaxing, sometimes falling asleep during treatment.</p>
<h2>Finding a RAC-Certified Reflexologist</h2>
<p>In Canada, look for practitioners certified by the Reflexology Association of Canada (RAC). RAC certification ensures the practitioner has completed a minimum of 200 hours of training. NutraCare360 lists verified RAC-certified reflexologists across Canada.</p>`,
    },
  ];

  await Blog.insertMany(blogs);
  console.log("4 blogs seeded");

  // ---- Success Stories ----
  const SuccessStorySchema = new mongoose.Schema({
    patientName: String, patientAvatar: String, patientCity: String,
    therapyType: String, practitionerName: String, story: String,
    beforeAfter: String, rating: Number, isPublished: Boolean,
  }, { timestamps: true });

  const SuccessStory = mongoose.model("SuccessStory", SuccessStorySchema);

  await SuccessStory.insertMany([
    {
      patientName: "Jennifer K.",
      patientCity: "Toronto, ON",
      therapyType: "Naturopathy",
      practitionerName: "Dr. Sarah Thompson",
      story: "After 3 years of unexplained fatigue and hormone issues, conventional medicine had no answers. Through NutraCare360, I found a Naturopathic Doctor in my city who did a thorough hormonal assessment. Within 4 months of treatment, my energy returned and I feel like myself again.",
      rating: 5,
      isPublished: true,
    },
    {
      patientName: "Marcus L.",
      patientCity: "Vancouver, BC",
      therapyType: "Acupuncture",
      practitionerName: "Michael Chen",
      story: "Chronic back pain for 6 years. Tried everything. A friend suggested I search NutraCare360 for an acupuncturist. Found Michael Chen — after 8 sessions, I'm 80% pain free. I wish I had found this platform sooner.",
      rating: 5,
      isPublished: true,
    },
    {
      patientName: "Roshni P.",
      patientCity: "Mississauga, ON",
      therapyType: "Homeopathy",
      practitionerName: "Dr. Leena Patel",
      story: "My 6-year-old daughter had constant ear infections. NutraCare360 helped me find a homeopath nearby. After constitutional homeopathic treatment, she hasn't had a single infection in 14 months. We are so grateful.",
      rating: 5,
      isPublished: true,
    },
    {
      patientName: "David M.",
      patientCity: "Calgary, AB",
      therapyType: "Chiropractor",
      practitionerName: "Dr. James MacKinnon",
      story: "As a desk worker, my neck and shoulders were constantly in pain. NutraCare360 made it easy to find a chiropractor accepting new patients near me. Dr. MacKinnon's holistic approach — chiropractic plus exercise coaching — has been life-changing.",
      rating: 5,
      isPublished: true,
    },
  ]);
  console.log("4 success stories seeded");

  await mongoose.disconnect();
  console.log("\n✅ Seed complete! Database populated successfully.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
