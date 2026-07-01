# Nisora - Personal Book Collection Manager

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_8-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Zustand](https://img.shields.io/badge/Zustand-4A4A55?style=for-the-badge&logo=react&logoColor=white)](https://zustand-demo.pmnd.rs/)

<details>
<summary><h2>🇮🇩 Bahasa Indonesia</h2></summary>

Nisora adalah aplikasi manajemen koleksi buku pribadi (_digital reading journal_) yang dirancang untuk melacak buku-buku yang sedang atau telah selesai dibaca. Dibangun dengan antarmuka yang modern, responsif, dan estetik, aplikasi ini menawarkan pengalaman pengguna yang mulus dalam mengelola perpustakaan pribadi.

### ✨ Fitur Utama

- **Katalog Buku Responsif** — Tampilan _grid_ elegan yang menampilkan sampul buku, judul, sinopsis, penulis, dan tahun terbit. Beradaptasi dengan mulus di perangkat _mobile_, _tablet_, dan _desktop_.
- **Filter Berdasarkan Status** — Navigasi _tab_ interaktif untuk menyaring buku berdasarkan kategori: _Semua_, _Sedang Dibaca_, dan _Selesai_.
- **Manajemen Data Buku** — Form penambahan buku interaktif menggunakan **Vaul drawer** dengan validasi sisi klien (**Zod** & **React Hook Form**).
- **Unggah Gambar Sampul** — Integrasi _file picker_ dengan _preview_ gambar langsung di sisi klien sebelum diunggah ke _storage_ Supabase.
- **Pencarian Cerdas (UI)** — Fitur _search bar_ pada _header_ yang didesain secara intuitif untuk kemudahan akses (siap untuk integrasi _filtering_ dinamis).
- **Notifikasi _Real-time_** — Sistem _toast notification_ yang informatif menggunakan **Sonner**.

### 🛠️ Tech Stack & Arsitektur

Nisora dibangun menggunakan teknologi web modern untuk memastikan performa maksimal dan skalabilitas:

- **Frontend Framework:** React 19 dengan Vite 8 untuk eksekusi yang sangat cepat.
- **Styling & UI:**
  - Tailwind CSS v4 & Sass untuk penyusunan _style_ yang fleksibel dan terstruktur.
  - shadcn/ui & Radix UI untuk komponen _accessible_ dan kustomisasi tanpa batas.
  - Vaul untuk laci interaktif (_drawer_) yang memberikan pengalaman _native-like_ di _mobile_.
- **State Management:** Zustand untuk pengelolaan _state_ global yang ringan dan reaktif.
- **Form & Validasi:** React Hook Form dikombinasikan dengan Zod untuk _type-safe schema validation_.
- **Backend & Database (BaaS):** Supabase (SSR & Client JS) untuk penyimpanan data relasional dan manajemen _storage_ aset gambar.

### 🎨 Design System

Aplikasi ini mengusung palet warna _warm & earthy_ untuk menciptakan nuansa membaca yang nyaman dan menenangkan:

| Token              | Kode Warna | Preview |
| ------------------ | ---------- | :-----: |
| **Background**     | `#faf6f0`  |   ⚪    |
| **Surface**        | `#f3ede4`  |   🌫️    |
| **Primary Text**   | `#4e4a56`  |   🌑    |
| **Secondary Text** | `#7a7684`  |   🪨    |
| **Accent**         | `#8fa8c7`  |   🧊    |

**Tipografi:**

- **Playfair Display (Serif):** Digunakan untuk _heading_, memberikan kesan editorial yang klasik dan mewah.
- **Noto Sans (Sans-serif):** Digunakan untuk teks tubuh (_body text_), memastikan tingkat keterbacaan yang tinggi.

_(Antarmuka aplikasi dirancang khusus untuk lokalisasi Bahasa Indonesia)._

### 🚀 Cara Menjalankan Secara Lokal

1. **Kloning repositori ini:**
   ```bash
   git clone https://github.com/username/nisora.git
   cd nisora
   ```
2. **Instal dependensi:**
   ```bash
   npm install
   ```
3. **Konfigurasi Environment:**
   Buat file `.env.local` di _root_ direktori dan tambahkan kredensial Supabase (merujuk pada `.env.example`):
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```
4. **Jalankan _development server_:**
   ```bash
   npm run dev
   ```
   _Aplikasi dapat diakses melalui `http://localhost:5173`_

---

_Dibuat dengan ❤️ untuk para pecinta buku._

</details>

<details open>
<summary><h2>🇬🇧 English</h2></summary>

Nisora is a personal book collection manager (a digital reading journal) designed to track books you are currently reading or have finished. Built with a modern, responsive, and aesthetic interface, this application offers a seamless user experience in managing a personal library.

### ✨ Key Features

- **Responsive Book Catalog** — An elegant grid view displaying book covers, titles, synopses, authors, and publication years. Adapts smoothly across mobile, tablet, and desktop devices.
- **Filter by Status** — Interactive tab navigation to filter books by categories: _All_, _Currently Reading_, and _Finished_.
- **Book Data Management** — An interactive book addition form using a **Vaul drawer** with client-side validation (**Zod** & **React Hook Form**).
- **Cover Image Upload** — File picker integration with real-time client-side image previews before uploading to Supabase storage.
- **Smart Search (UI)** — Intuitively designed search bar in the header for easy access (UI ready for dynamic filtering integration).
- **Real-time Notifications** — Informative toast notification system powered by **Sonner**.

### 🛠️ Tech Stack & Architecture

Nisora is built using modern web technologies to ensure maximum performance and scalability:

- **Frontend Framework:** React 19 with Vite 8 for blazing fast execution.
- **Styling & UI:**
  - Tailwind CSS v4 & Sass for flexible and structured styling.
  - shadcn/ui & Radix UI for highly accessible, endlessly customizable components.
  - Vaul for interactive drawers providing a native-like experience on mobile.
- **State Management:** Zustand for lightweight and reactive global state management.
- **Form & Validation:** React Hook Form combined with Zod for type-safe schema validation.
- **Backend & Database (BaaS):** Supabase (SSR & Client JS) for relational data storage and image asset management.

### 🎨 Design System

This app embraces a warm & earthy color palette to create a comfortable and calming reading atmosphere:

| Token              | Color Code | Preview |
| ------------------ | ---------- | :-----: |
| **Background**     | `#faf6f0`  |   ⚪    |
| **Surface**        | `#f3ede4`  |   🌫️    |
| **Primary Text**   | `#4e4a56`  |   🌑    |
| **Secondary Text** | `#7a7684`  |   🪨    |
| **Accent**         | `#8fa8c7`  |   🧊    |

**Typography:**

- **Playfair Display (Serif):** Used for headings, giving a classic and luxurious editorial feel.
- **Noto Sans (Sans-serif):** Used for body text, ensuring high readability.

_(The application interface is exclusively localized in Indonesian)._

### 🚀 How to Run Locally

1. **Clone this repository:**
   ```bash
   git clone https://github.com/username/nisora.git
   cd nisora
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment Configuration:**
   Create a `.env.local` file in the root directory and add your Supabase credentials (refer to `.env.example`):
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
   _The application will be available at `http://localhost:5173`_

---

_Built with ❤️ for book lovers._

</details>
