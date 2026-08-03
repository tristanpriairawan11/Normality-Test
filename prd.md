# PRD - Website Uji Normalitas Data

## 1. Ringkasan

Website yang memudahkan pengguna melakukan uji normalitas terhadap data numerik tanpa perlu menggunakan software statistik seperti SPSS, Stata, atau R.

Pengguna dapat:

* Upload file CSV atau Excel
* Mengetik data secara manual
* Memilih metode uji normalitas
* Atau membiarkan sistem memilih metode terbaik secara otomatis berdasarkan jumlah sampel.

---

# 2. Tujuan

Memberikan website yang:

* Mudah digunakan
* Cepat
* Akurat
* Otomatis memilih uji terbaik apabila pengguna tidak memahami jenis uji normalitas.

---

# 3. Target User

* Mahasiswa
* Peneliti
* Dosen
* Data Analyst
* Praktisi statistik

---

# 4. Fitur

## 4.1 Input Data

Pengguna dapat memilih salah satu:

### Upload File

Support:

* CSV
* XLS
* XLSX

Setelah upload:

* menampilkan preview data
* pengguna memilih kolom numerik yang akan diuji

---

### Input Manual

Textarea besar.

Contoh:

```
12
15
18
17
22
19
21
```

Atau

```
12,15,18,17,22,19,21
```

Sistem otomatis memisahkan berdasarkan:

* Enter
* Koma
* Titik koma
* Spasi

---

# 5. Validasi Data

Sistem harus:

* Menghapus nilai kosong
* Menghapus whitespace
* Memastikan seluruh data numerik
* Menghitung jumlah observasi (N)

Jika setelah dibersihkan jumlah data kurang dari 3 maka tampilkan:

> Minimal diperlukan 3 data untuk melakukan uji normalitas.

---

# 6. Pilihan Uji Normalitas

Daftar pilihan:

* Jarque Bera
* Skewness Kurtosis
* Shapiro Wilk
* Shapiro Francia
* Ryan Joiner
* Lilliefors
* Cramer Von Mises
* Anderson Darling
* Kolmogorov Smirnov

Dropdown:

```
Pilih metode

(Default)
Otomatis (Disarankan)

----------------

Jarque Bera
Skewness Kurtosis
Shapiro Wilk
Shapiro Francia
Ryan Joiner
Lilliefors
Cramer Von Mises
Anderson Darling
Kolmogorov Smirnov
```

---

# 7. Pemilihan Otomatis (Default)

Apabila pengguna **tidak memilih metode**, sistem wajib menentukan metode terbaik berdasarkan jumlah data (N).

## Aturan

| Jumlah Sampel   | Uji yang Dipilih |
| --------------- | ---------------- |
| 3 ≤ N ≤ 4       | Jarque Bera      |
| 5 ≤ N ≤ 6       | Shapiro Francia  |
| 7 ≤ N ≤ 9       | Shapiro Wilk     |
| 9 ≤ N ≤ 50      | Shapiro Wilk     |
| 51 ≤ N ≤ 200    | Jarque Bera      |
| 201 ≤ N ≤ 2000  | Jarque Bera      |
| 2001 ≤ N ≤ 5000 | Jarque Bera      |
| N ≥ 5001        | Jarque Bera      |

## Catatan

Berdasarkan referensi terdapat beberapa rentang yang memiliki dua metode terbaik.

Website menggunakan aturan berikut:

### 7 ≤ N ≤ 9

Gunakan

**Shapiro Wilk**

(bukan Ryan Joiner)

---

### 9 ≤ N ≤ 50

Gunakan

**Shapiro Wilk**

(bukan Shapiro Francia)

---

### 201 ≤ N ≤ 2000

Gunakan

**Jarque Bera**

(bukan Skewness Kurtosis)

---

### 2001 ≤ N ≤ 5000

Gunakan

**Jarque Bera**

(bukan Skewness Kurtosis)

---

### N ≥ 5001

Gunakan

**Jarque Bera**

(bukan Skewness Kurtosis)

---

# 8. Informasi yang Ditampilkan

Setelah data dimasukkan, tampilkan:

Jumlah data

```
N = 156
```

Metode yang digunakan

```
Jarque Bera
```

atau

```
Dipilih otomatis:
Jarque Bera
```

---

# 9. Hasil Uji

Tampilkan:

## Nama uji

Contoh

```
Shapiro Wilk Test
```

---

## Statistik uji

Misal

```
Statistic = 0.9812
```

---

## p-value

```
p-value = 0.243
```

---

## Alpha

Default

```
0.05
```

Bisa diubah pengguna.

---

## Keputusan

Jika

```
p ≥ α
```

Tampilkan

✅ Gagal menolak H0.

Data berdistribusi normal.

---

Jika

```
p < α
```

Tampilkan

❌ Tolak H0.

Data tidak berdistribusi normal.

---

# 10. Hipotesis

Selalu tampilkan

H0

```
Data berasal dari populasi yang berdistribusi normal.
```

H1

```
Data tidak berasal dari populasi yang berdistribusi normal.
```

---

# 11. Ringkasan Hasil

Contoh

```
Jumlah data : 156

Metode : Jarque Bera

Statistic : 2.138

p-value : 0.118

Kesimpulan :

Karena p-value ≥ 0.05 maka gagal menolak H0.

Tidak terdapat bukti yang cukup bahwa data tidak berdistribusi normal.
```

---

# 12. Tombol

```
Upload File

Input Manual

Hitung

Reset

Download Hasil
```

---

# 13. Download Hasil

Format:

* PDF
* CSV

Isi PDF:

* Jumlah sampel
* Metode
* Statistik
* p-value
* Alpha
* Keputusan
* Kesimpulan

---

# 14. UI/UX

Halaman utama:

```
====================================

        Uji Normalitas Data

====================================

[ Upload CSV / Excel ]

atau

[ Input Manual ]

------------------------------

Kolom Data

------------------------------

Metode

(Otomatis ▼)

------------------------------

Alpha

0.05

------------------------------

[ Hitung ]

--------------------------------

HASIL

Jumlah Sampel

Metode

Statistic

p-value

Keputusan

Kesimpulan

--------------------------------

Download PDF

Download CSV
```

---

# 15. Teknologi

Frontend:

* React
* Next.js
* TypeScript
* Tailwind CSS

Backend:

* Python
* FastAPI

Library statistik:

* scipy
* statsmodels
* pandas
* numpy
* openpyxl

---

# 16. Acceptance Criteria

* Upload CSV/XLS/XLSX berhasil.
* Input manual mendukung pemisah enter, koma, titik koma, dan spasi.
* Sistem otomatis membersihkan data kosong.
* Sistem menghitung jumlah sampel (N) secara otomatis.
* Jika metode tidak dipilih, sistem memilih metode terbaik sesuai aturan jumlah sampel yang telah ditetapkan.
* Pengguna dapat memilih salah satu dari 9 metode uji normalitas secara manual.
* Hasil menampilkan nama uji, statistik uji, p-value, nilai α, hipotesis, keputusan, dan kesimpulan.
* Hasil dapat diunduh dalam format PDF dan CSV.
* Tampilan responsif pada desktop maupun perangkat mobile.
