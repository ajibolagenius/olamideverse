# OlamideVerse Content Research Report

**Date:** 6 November 2026
**Method:** six parallel web-research agents (discography, singles/awards, biography, slang, media/videography, influence/impact), each instructed to cite a source per claim and flag unverified items. Every "correction" was then re-checked against the actual files in `content/` — several agent-reported errors turned out to be briefing artifacts, not archive errors. Only file-verified issues are listed as corrections below.

**Scope:** research only. No content files were modified by this exercise.

---

## 1. Executive summary

The archive is in better shape than feared. Album dates, era assignments, and the song catalogue are largely current and accurate (the catalogue already carries 2026 records like "Burukutu", "Zion", "Omo Naija"). The real gaps, in priority order:

1. **Media library is stale.** `content/media/media.json` (95 items) has almost nothing after 2021 — 2 videos in 2017, 1 in 2019, 3 in 2020, 5 in 2023, **zero for 2024, and only "Kai!" for 2025** — while the catalogue knows about at least 20 official videos from 2022–2026. This is the largest populating gap.
2. ***Time & Space* is not enrolled anywhere.** Olamide's next album is out **16 November 2026 — ten days from now** (announced 20–21 Oct 2026, 10 tracks, lead single "Burukutu" with a TG Omori video). Nothing in eras, albums, snippets, or the changelog anticipates it. This is the most time-sensitive item.
3. **The slang glossary has only 7 entries.** Research surfaced 19 defensible additions (each with literal/street glosses, the song and year that carried it, and its mainstream afterlife) plus corrections to four of the existing seven.
4. **Fact errors in the impact map:** "Port Harcourt — Phyno's city" is wrong (Phyno is from Enugu), and the OLIC pin is mislabeled "National Stadium" with an unverified "25,000 projected" claim that contemporary coverage contradicts (OLIC ran at Eko Hotel; OLIC4 at Teslim Balogun Stadium, Surulere, and was noted for a *low* turnout).
5. **Influence graph is missing Dagrin** — the single most documented lineage claim in Olamide's own words ("I listen to Dagrin's album for inspiration"), plus Naira Marley, Zlatan, and the 2025 ID Cabasa reunion.
6. **The bio lacks a birthdate** and misses five 2025–2026 milestones: first African rapper past 1B Spotify streams (10 Jan 2025), Billboard Global Power Player 2025, sold-out OVO Arena Wembley (23 Nov 2025), the Bariga street renamed "Olamide Adedeji (Baddo) Street" (Jul 2025), and the announced O2 Arena headline (25 Mar 2027).

---

## 2. Discography — state and actions

### 2.1 Verified master list (against the archive's 15 album files)

All 15 existing entries match the verified record. Key confirmed values:

| Project | Verified | Archive | Note |
|---|---|---|---|
| Rapsodi | album, 21 Mar 2011, Coded Tunes | 2011 ✓ | |
| YBNL | album, 12 Nov 2012 | 2012 ✓ | digital-day discrepancy 21 vs 24 Jun 2013 (ignore, year-level) |
| Baddest Guy Ever Liveth | album, 7 Nov 2013 | 2013 ✓ | |
| Street OT | album, 14 Nov 2014 | 2014 ✓ | #1 iTunes World; Headies 2015 AOTY |
| 2 Kings (with Phyno) | joint, **1 Apr 2015**, Penthauze/YBNL | 2015 ✓ | agent "correction to 2014" was a briefing artifact — file already says 2015 |
| Eyán Mayweather | album, 23 Nov 2015 | 2015 ✓ | diacritic form **Eyán Mayweather** — archive writes "Eyan Mayweather"; add the á somewhere discoverable |
| The Glory | album, 23 vs 26 Dec 2016 | 2016 ✓ | day-level source conflict |
| Lagos Nawa | album, **17 Nov 2017** | 2017 ✓ | file already correct |
| YBNL MaFia Family | **label compilation**, 14 Dec 2018 | type `joint` — acceptable | retitle consideration: "label group album" is the accurate frame |
| 999 | EP, **9 Feb 2020** | 2020 ✓ | see correction C-1 |
| Carpe Diem | album, 8 Oct 2020, first Empire release | 2020 ✓ | file already correct (agent flagged a nonexistent "2010 mixtape" claim) |
| UY Scuti | album, 18 Jun 2021 | 2021 ✓ | style: **UY Scuti** (file title already UY Scuti) |
| Unruly | album, 9 Aug 2023 | 2023 ✓ | |
| Ikigai | EP, 26 Jun 2024 | 2024 ✓ | era `legacy` correct; day conflict 26 vs 27 Jun in press |
| Olamidé | album, **19 Jun 2025**, 17 tracks | 2025 ✓ | present and correctly titled (agent initially believed it missing — verified present) |

**Empire deal date:** announced **18–19 Feb 2020**, not "10 June 2020" (a claim some fan pages circulate). The bio's "eight days later" phrasing (line 47) is consistent with the Feb dates.

### 2.2 Additions

- **A-1 · *Time & Space* (upcoming).** Due **16 Nov 2026** (pre-add dates seen as 16–17 Nov), 10 tracks announced, 12th/13th studio album (sources conflict on numbering because of the *Magina* / *Everyday a Sunna* question). Lead single **"Burukutu"** (video 20–21 Oct 2026, dir. TG Omori). Sources: [Guardian NG](https://guardian.ng/saturday-magazine/olamide-sets-november-16-as-release-date-for-new-album-time-and-space/), [BellaNaija](https://www.bellanaija.com/2026/10/olamide-burukutu-video-time-and-space-album/), [Apple Music album page](https://music.apple.com/us/album/time-and-space/6823312075). Recommend an `era`/`album` hook in `legacy.mdx` as an "announced, not released" note now, and full enrollment after release. Do **not** add it as released.
- **A-2 · *Magina* (2018) and *Everyday a Sunna* (2019)** — two projects reported in press but absent from Wikipedia's studio list; exact dates unresolved. This is the root of the 11th-vs-12th album numbering conflict. Status: **UNVERIFIED at date level** — worth one line in `reinvention.mdx` ("press-reported projects of this period, dates unresolved") or Genius/Discogs verification before adding entries.
- **A-3 · Guest appearance:** "Wound Someone" on Empire's *Where We Come From, Vol. 01* (30 Nov 2022) — a catalogue `feature`, not an album entry. [Wikipedia](https://en.wikipedia.org/wiki/Where_We_Come_From,_Vol._01).

### 2.3 Corrections (file-verified)

- **C-1 · 999 release date, 9 February 2020** (not 10 February). [Wikipedia 999 EP](https://en.wikipedia.org/wiki/999_(EP)) infobox `released = {{start date|2020|02|09|df=y}}`, confirmed on [Olamide discography](https://en.wikipedia.org/wiki/Olamide_discography), and [Guardian](https://guardian.ng/life/olamide-releases-his-surprise-ep-999/). The date appeared in four places, and the first pass fixed only one of them; the full set is:
  - `content/eras/reinvention.mdx:16` — era body "on 10 February 2020" → 9 February.
  - `content/eras/reinvention.mdx:29` — moment chip "10 Feb 2020" → "9 Feb 2020".
  - `content/albums/999.mdx:6` — `released:` field, and `:59` credits line.
  - `content/eras/reinvention.mdx:17` and `content/biography/biography.mdx:49` — the gap to the Empire announcement. That announcement is Olamide's own post of 18 February 2020 ([Channels TV](https://www.channelstv.com/2020-02-19/olamides-ybnl-signs-joint-venture-deal-with-empire-distribution/), [Premium Times](https://www.facebook.com/Premiumtimes/posts/2785482208156042/)), so 9 Feb → 18 Feb is **nine days**: "Eight days later" and "Ten days later" both became "Nine days later".

### 2.4 Tracklist spot-checks worth folding into album stories

- *Eyán Mayweather* (2015) is **feature-free** — a standout fact for the album page.
- *999*: "Billion Talk" features **Milly — Olamide's son**; "Warlords" ft Snow, Phyno, Cheque, Rhatti (archive tracklist matches).
- *Olamidé* (2025): "Indika" ft **Dr. Dre & Spinall**, "Kai!" w/ Wizkid, "Billionaires Club" w/ Wizkid & Darkoo, "99" w/ Daecolm, Asake, Seyi Vibez, Young Jonn, "Rain" ft Popcaan; release slipped 3 → 9 → 19 Jun 2025; TurnTable NG #1, Billboard World #6. The NATIVE review (Dami Ajayi) notes the correct Yoruba spelling is **Ọlámidé**.
- *Ikigai* (2024): won **AEA-USA Album of the Year**; US vinyl 30 Jan 2025.
- *Carpe Diem*: first African rap album to 200M Spotify streams (press-reported), 500M streams in 8 months, Headies 2022 Best Rap Album.

---

## 3. Singles, features, charts, awards

### 3.1 Catalogue currency

The 480-entry catalogue covers the verified Wikipedia lead-single list essentially completely through 2026 — including "Burukutu", "Zion" (Teni, 24 Apr 2026, Gamma Africa), "Idi Bad" (KCee, 16 Apr 2026), "Fuji Party" (Seyi Vibez, Nov 2025), "Order" (Shallipopi), and even 2026 pre-album singles already listed ("Omo Naija", "Rock Me Gentle", "Come On", "Goosebumps", "Formation" (Adekunle Gold), "Skido", "Belinda", "Motivate"). No lead single through today is missing.

**Non-existent records — keep out:** "Japa" is Naira Marley (2018), "Human" and "Umlane" have no Olamide record, "Choko on top" is actually **"Choko Milo"** (2019), and there is no single "Hello" — the real record is **"Hello Habibi" ft Russ** (2024).

### 3.2 Catalogue fixes

- **C-2 · "Kai!" mis-typed** — in `catalog.json` the Kai! entry carries `type: "snippet"`; it is the lead single of *Olamidé* (28/29 Apr 2025) and should be `single` (or the album-track form). [Kai! – Wikipedia](https://en.wikipedia.org/wiki/Kai!).
- **C-3 · "Welcome" (2018) id is corrupted** — `id: "single--waptrick--welcome-2018"` names Waptrick, but the single is a YBNL MaFia Family opener; the entry also duplicates album track 1. Rename the id and demote to album-linked (`alsoSingles`), like "Motigbana"/"Poverty Die" already are.
- **Add chart metadata (optional enhancement):** "New Religion" #1… peaked **#2 TurnTable NG Top 100** (11th top-10 entry); "Jinja" #5; "Gaza" #10; "Kai!" #9 TurnTable, #10 US Billboard Afrobeats, #7 UK Afrobeats. [TurnTable](https://www.turntablecharts.com/news/911).
- **Possible missing features:** "Wonders" (Shatta Wale collab performance, Ghana 2016 — video-only sourcing), "Ibadi" (Lace EP feature, 4 Sep 2026, [Shazam](https://www.shazam.com/song/6795390704/ibadi)) — verify both on streaming before adding.

### 3.3 Awards & milestones ledger (verified, with sources)

| Date | Item | Status |
|---|---|---|
| 2012 | Headies Best Rap Album nom ("Young Erikina") | Nominated |
| 2013 | **First Nigerian artist with a Cîroc endorsement (17 Jul 2013)** | Milestone |
| 2013/2014 | Headies **Album of the Year** ×2 (*YBNL*, *BGEL*) | Won |
| 2014 | "Local Rappers" — TooXclusive Best Hip-Hop Track 2015 lineage | Won |
| 2015 | Headies Artiste of the Year; "Bobo" Best Street-Hop; "Who You Epp?" Best Street-Hop 2016 | Won |
| 2016 | MOBO Best African Act | Nominated |
| 2017 | NEA Album of the Year (*The Glory*) | Won |
| 2020 | BET Awards Best International Act | Nominated |
| 2022 | Headies Best Rap Album (*Carpe Diem*) | Won |
| Nov 2023 | **Grammy nomination — Best African Music Performance, "Amapiano" w/ Asake (66th Grammys, lost to Tyla)** — first Nigerian rapper nominated in the category | Nominated |
| 2024 | NAACP Image Award nom ("Amapiano"); AEA-USA Album of the Year (*Ikigai*) | Won/Nom |
| **10 Jan 2025** | **First African rapper to surpass 1 billion Spotify career streams** | Milestone ([Daily Post](https://dailypost.ng/2025-01-10/olamide-becomes-first-african-rapper-to-hit-1-billion-streams-on-spotify/)) |
| 27 Apr 2025 | Headies 2025: "Metaverse" MV of the Year nom (lost to "Egwu"), no wins | Nominated |
| 2025 | **Billboard Global Power Player** | Won |
| 2025 | Spotify editorial: "most influential street-pop artiste of his generation" | Recognition ([Premium Times](https://www.premiumtimesng.com/news/more-news/653096-olamide-is-most-influential-street-pop-artiste-of-his-generation-spotify.html)) |
| **23 Nov 2025** | **Sold out OVO Arena Wembley — reported first Nigerian rapper to do so** | Milestone ([OVO](https://www.ovoarena.co.uk/events/detail/olamide)) |
| 1 Jan 2026 | "Mission 26K" Mainland Block Party headline, Police College Ikeja GRA | Verified ([YBNL FB](https://www.facebook.com/ybnlnewz/)) |
| **25 Mar 2027** | **O2 Arena London headline announced — billed as a first for a Nigerian act** | Announced ([O2](https://www.theo2.co.uk/events/detail/olamide)) |

**Rejected milestone claims (fan-media only, do not publish):** "first Nigerian rapper to 1M YouTube subscribers" (channel now ~1.4M, no press record of the milestone), any VEVO first, "400M Boomplay streams", "Olamidé 4.98M first-day Spotify record" (social-only).

---

## 4. Biography & timeline

### 4.1 What the archive already gets right

`content/biography/biography.mdx` correctly states: full name form **"Olamidé Gbenga Adedeji"** (Wikipedia's unaccented form: Olamide Gbenga Adedeji), **Tai Solarin University dropout** (mass communication, Ijebu-Ode; dropped out for financial reasons), Bariga upbringing, Coded Tunes signing 2010, "Eni Duro" → HHWA 2010 performance, Rapsodi 21 Mar 2011, Empire deal "eight days later" framing. Rumour items the agents feared ("Oluwásemílobe", Poly Ibadan, 6 March birthday, 10 June Empire date) are **not** in the file.

### 4.2 Corrections/additions

- **A-4 · Add the birthdate.** The bio never states it. Verified: **born 15 March 1989, Bariga, Lagos** (raised in Ladilak, Bariga; state of origin Ibadan, Oyo). Note: his fan-lore "6 March" is wrong. [Wikipedia](https://en.wikipedia.org/wiki/Olamide).
- **A-5 · Family detail (all documented, handle with care):** second of Pa Adedeji's three children (with Ronke Osisanya Adedeji); siblings include **TemmyGold and DJ Enimoney** (Eniola Olamilekan Adedeji) — the DJ Enimoney/YBNL link is *familial*, a great archive fact; married Adebukunmi Aisha Suleiman (proposal reported Mar 2018, wedding private — no date); children per Wikipedia: Batifeori, Tunrepin Myles ("Lil Baddo", the "Milly" of 999's "Billion Talk"), daughter Mowaririfunoluwa Celine. **Avoid:** the Beat FM/Maria Okanrende parentage dispute and the "married 14 years" IG quote (contradicts 2018 timeline) — contested/unverified.
- **A-6 · Cabasa origin detail:** Cabasa says he first met Olamide as a boy of ~13–14 who came to the studio with a friend ([Gaise Baba interview](https://www.youtube.com/watch?v=CbaKcZ0gh2s)) — deepens `the-upstart`.
- **C-4 · Asake status.** If any page still frames Asake as YBNL talent: Asake **signed Feb 2022, exited 12 Feb 2025**, releasing "Why Love" under his own **Giran Republic**. Soften "diss track" framing — widely read as pointed, never formally styled a diss. [Guardian](https://guardian.ng/life/music/asake-officially-dumps-ybnl-sets-up-own-record-label/).
- **A-7 · Missing 2024–2026 beats for the `legacy` era:** Kai! record-breaking streaming (Apr 2025); the Ọlámidé diacritic-spelling debate; Headies 2025 no-win (street-hop baton passing); **ID Cabasa reunion — "OK" on *Unfinished Business* (Dec 2025)**, closing the Coded Tunes loop 15 years after Rapsodi; Apr 2026 Korty EO interview on **stage anxiety from fans snatching his jewelry** (humanizes the Street King persona); 4 Nov 2026 *Sotayo Gaga* screening statement ("Our culture and tradition is not diabolical…"); Afro Nation Portugal 2026 set (video-only sourcing — verify); *Time & Space* announcement.
- **Legacy quotes (sourced, ready to use):**
  - Dami Ajayi, The NATIVE (4 Jul 2025): "the poster boy for the Lagos working-class kid… the most unlikely heir to Dagrin's template" ([review](https://thenative.africa/a-review-olamide-olamide-42524)).
  - Shallipopi (14 Nov 2024): "Baddo is the father and king of Nigerian street music" ([Nation](https://thenationonlineng.net/olamide-king-of-nigerian-street-music-shallipopi/)).
  - ID Cabasa: "I cried the day Olamide left Coded Tunes."

### 4.3 Roster chronology (for a possible label-history section)

Gen-1: Lil Kesh (Mar 2014 → left Apr 2016, founded YAGI), **Adekunle Gold "Ariye Gold" era (Mar 2015 — Pheelz played "Sade" to Olamide; AG also designed the YBNL logo)**, Chinko Ekun, Viktoh, Temmie Ovwasa (**Aug 2015**, not Apr 2016; left 2020 after public dispute, since reconciled), Davolee, Limerick — mass exit Dec 2016–2017; Xino apology fallout Jan 2017. Gen-2: Lyta + Limerick (Feb 2018), **Naira Marley (signed 2018, left May 2019 → Marlian)**, Pele Pele & Picazo Rhap, Yomi Blaze (15 Oct 2018, signed hours after Picazo), **Fireboy DML (Oct 2018 press; signing date never officially published)**. Gen-3: Asake (Feb 2022 → 12 Feb 2025), Senth (Nov 2022). Late 2026: Wikipedia lists **Olamide and Fireboy only**, plus in-house producers Pheelz, Young Jonn, B-Banks, P.Priime, DJ Enimoney, plugger Olaitan Salaudeen. Wande Coal's signing is **never dated by reliable press** — treat as collaboration-only.

---

## 5. Slang glossary — 7 → 26

### 5.1 Corrections to existing entries

- **S-1 · "Baddo Sneh"** — "Baddo" alone is the canonical tag (from *Baddest Guy Ever Liveth*, 2013; "Day 1 Baddo"). No source for the "Sneh" extension (the gloss "the bad one, sincerely" is folk etymology). Recommend retitling to **"Baddo"** with a usage note.
- **S-2 · "Shakitibobo"** — the canonical song title is **"Bobo (Shakiti Bobo)"** (single 2 May 2015, from *Eyán Mayweather*, prod. Young Jonn). The dance is named **after the song**, and Olamide said in a Tunde Kelani interview it came from a **Bariga nursery rhyme**. Add the **LT's "Yobo" dance-stealing accusation (2017)**.
- **S-3 · "Wó!"** — the official title is **"Lagos Nawa (Wobey Sound)"**, 7 Aug 2017. Add: **this video is where the shaku shaku first reached the mainstream** (per Wikipedia's Afrobeats article), and Wizkid publicly called it the biggest Nigerian song of 2017.
- **S-4 · "Ẹni Dúró"** — standard literal is "the one who stands/waits" (current "Whoever stands / anyone who waits" is fine); state that this 2010 single **launched the career**. Avoid the mp3bullet "you dare not wait" gloss.
- **S-5 · "Ọmọ Wóbè"** — literal "child of the cola nut" = one's own child; flag that it is **common Yoruba predating him** (popularized, not coined). The weed-follower reading is weak evidence — drop or mark UNVERIFIED. (Current archive gloss "child of the hood" is a reasonable street gloss.)
- **S-6 · "Science Student"** — year 2018 already correct in the file ✓. Add afterlife: **NBC/FVCB ban petitions over "obscene" content in 2018** — the strongest moral-panic datapoint in the glossary.
- **Shoki** — archive already credits the Lil Kesh remix correctly ✓; optionally add "originator: Lil Kesh (2014), a then-YBNL act" nuance and the academic "quickie" gloss.

### 5.2 Proposed additions (19, each verified to a song/press record)

| Term (diacritics) | Street gloss | Carrier song / year | Attribution | Standout afterlife |
|---|---|---|---|---|
| Dúróṣọ̀kẹ́ ("Durosoke") | stand on high / never fold | "Durosoke", 1 May 2013, BGEL | popularized | permanent ad-lib; politicians' rally cry; beer adverts |
| Who You Epp | who do you fear? (etymology UNVERIFIED) | "Who You Epp?" 2016, Headies Best Street-Hop | coined | the open-verse cypher template of 2016 |
| Pepper Dem / Pẹ́pà Dem | agitate them | crew brand "Pepper Dem Gang", *Eyán Mayweather* era | brand-coined | generic Naija verb "pepper dem" |
| Ẹyàn Mayweather | street tough styled on Floyd | album 2 May 2015 | coined | "eyan" in Nollywood/skits |
| Ilẹ́fọ̀ Illuminati | the underestimated king | single 2011 → *YBNL* 2012 | coined | his meme-identity nickname for a decade |
| YBNL (Yahoo Boy No Laptop) | label backronym | *YBNL* 2012 (track "Yahoo No Laptop") | brand | 2012 yahoo-panic press cycle; note "Yankee Boy" variant circulates |
| Ọwọ́ Blọ́ / Owo Blow | fast money | *Eyán Mayweather* tr.12, 2015 | popularized | alcohol brands used it in adverts; "action po bi Ogogo" meme |
| Wobey | the sound of the streets | *Lagos Nawa (Wobey Sound)* 2017 | coinage (etymology UNVERIFIED) | Slimcase's whole career; Guardian used "wobey" as genre shorthand |
| Shaku Shaku | the dance | "Wo" (2017) + "Science Student" (2018) | **amplifier, NOT coiner** (street/DJ Real origin) | 2018 global wave; Zanku (Zlatan) derives from it |
| Bùgá | flee / flash wealth | "Buga Small Small", Mar 2019 | early usage; phenomenon is Kizz Daniel ft Tekno 2022 | politician & footballer challenges |
| Pàwọ́n (Pawon) | hit them / beat them | single, 2019, dir. TG Omori | popularized | the "Pawon" waist dance; OAU campus chant controversy |
| Kọ́nkọ́bilítì | nonce-word swagger | single 3 Jun 2016, prod. Young Jonn | coined | slang-graveyard material; viral interview where he can't define it |
| Wọ́sẹ́ (Woske) | watch yourself (UNVERIFIED) | single 8 Feb 2019 video | popularized | top-5 street anthem of 2019 |
| Túrn Up | party hard | BGEL era track | **imported & vernacularized**, not coined | stock Naija club-branding phrase |
| Wonma | dismissive tag | BGEL-era recurrence | UNVERIFIED etymology | advert usage per the Medium cultural study |
| Kọ́ṣẹ́rẹ́ ní Moscow | no games in Moscow (yahoo caution) | Kida Kudz track ft Olamide, 2011 | featured, not originator | Nairaland-era street banter |
| Shọ́rọ́ Níyẹn | enough of your reasoning | YBNL Allstars track, 2015-era | amplifier | skit vocabulary |
| Motigbana | "mo ti gbana" — I'm lit | single 17 Aug 2018 video | track attribution UNVERIFIED | The Native explainer entry |
| Gbedu | drum / banger | recurrent | **pre-existing Yoruba — do not claim coinage** | general slang |

Key research source for the coined-vs-popularized distinction: [mp3bullet.ng "Street Slangs Olamide made viral"](https://www.mp3bullet.ng/street-slangs-that-olamide-made-viral-through-his-songs/), corroborated by [Guardian 2018 profile](https://www.theguardian.com/music/2018/jan/05/olamide-nigeria-street-hop-wobey), [Nairaland](https://www.nairaland.com/4537224/9-nigerian-music-influenced-slangs), and the [Medium "Cultural Phenom" study](https://medium.com/@dasoayomide/olamide-the-cultural-phenom-460ef72f7af8).

### 5.3 REJECTED list (wrongly attributable to Olamide — keep the glossary honest)

Ye (Burna Boy) · Love Nwantiti (CKay) · Zanku (Zlatan) · Buga-the-hit (Kizz Daniel ft Tekno) · Kukere (Iyanya) · Japa (2020s migration discourse, no song originator) · Maga/Mugu (yahoo slang; Bella Shmurda's 2020 record) · Shataye (2023 Asake/2Baba discourse) · Maruba wave (Naira Marley) · Shakara (general Yoruba) · Gbedu (general Yoruba). Also: no Olamide records named "Gele Gecko", "Kuku Su", "No B's", "Maximum Level", "Big Big Thing", "Yansoh" were found anywhere in his verified discography — if any surface in site copy, they are misattributions.

---

## 6. Media library — the biggest gap

95 items; year distribution `2010:1, 2011:2, 2012:10, 2013:14, 2014:11, 2015:14, 2016:13, 2017:2, 2018:6, 2019:1, 2020:3, 2021:9, 2022:3, 2023:5, 2025:1`. The 2016–2020 loose-single era and everything 2023–2026 is thin-to-empty. Below is the verified universe to diff against (dates = video premiere date, director where documented):

### 6.1 Missing official videos — 2018–2020

Science Student (26 Feb 2018, **Unlimited L.A**, choreo Kaffy) · Kana w/ Wizkid (15 Jun 2018, Sesan) · Motigbana (17 Aug 2018, Unlimited L.A) · Criteria (~1 Sep 2018, director UNVERIFIED) · Logba Logba (12 Sep 2018, Unlimited L.A) · Poverty Die (Nov–Dec 2018, Unlimited L.A) · Woske (8 Feb 2019, Unlimited L.A) · Oil & Gas (5 Jun 2019, TG Omori) · Totori w/ Wizkid & ID Cabasa (3 Jul 2019, TG Omori) · Pawon (Sep 2019, TG Omori) · Eru (8 Sep 2020, Clarence Peters) · Green Light (3 Oct 2020, uncredited) · Triumphant (Bella Shmurda, 2 Nov 2020) · Infinity (Omah Lay, 10 Nov 2020) · Loading (Bad Boy Timz, 1 Dec 2020) · Julie (17 Jul 2021, Patrick Elis) · Jailer (16 Sep 2021, Clarence Peters — **check feature credit: press says Jaywillz, single credits Bad Boy Timz**).

### 6.2 Missing official videos — 2022–2026

Hate Me w/ Wande Coal (Mar 2022, TG Omori) · Trumpet ft CKay (20 Apr 2023, Jyde Ajala) · New Religion ft Asake (Jun 2023, **Jyde Ajala — not TG Omori**) · Jinja (Aug 2023, Jyde Ajala) · Problem (Oct 2023) · Metaverse (27 Jun 2024, Jyde Ajala) · Uptown Disco (Aug 2024, Jyde Ajala) · 99 (10 Jun 2025, Liam S. Gleesen) · Billionaires Club (19 Aug 2025, Jyde Ajala) · Luvaluvah (12 Sep 2025, Jyde Ajala co-dir w/ Jamila) · **Burukutu (20 Oct 2026, TG Omori)**.

### 6.3 Not videos — label correctly

Makaveli, Morowore, Indika, Gaza, Shibebe, Mukulu = **official visualizers** only. Loose It, We Outside, Bugle, Choko Milo, Spirit = **no official video** (audio/dance-video only). Do not add as `music-video` items.

### 6.4 Featured-artist videos to confirm present

Reggae Blues (Harrysong, 7 Aug 2015, **Adasa Cookey** — commonly miscredited to Clarence Peters) · Local Rappers (Reminisce, 8 May 2015, **Mex**) · Fada Fada (Phyno, Clarence Peters) · Instagram (Reminisce, TG Omori) · ZaZoo Zehh (Portable, TG Omori) · Amapiano (Asake, Jyde Ajala) · Omo Ope (Asake) · Gobe (Pheelz) · Kpe Paso, Wahala, Currency, Order, Zion (directors UNVERIFIED).

### 6.5 Live & long-form (verified only)

- **Coke Studio Africa ×2** — "Turn Up" w/ Fena (S2) and "Kolole" w/ AKA/Sketchy Bongo (2017). Strongest live-media asset.
- **Flytime Fest 2024** (23 Dec, Eko Hotel, ~3-hour headline set) and Flytime 2025 w/ Reminisce.
- **Headies 2015 Next Rated clash** w/ Don Jazzy (1 Jan 2016, Landmark) — documented.
- **OVO Arena Wembley sold-out** (23 Nov 2025); **Mission 26K** Ikeja (1 Jan 2026); **O2 Arena** (25 Mar 2027, announced).
- **Docs/interviews:** *Afrobeats: The Backstory* (2021, his dropout story) · The AfroBeats Interviews ([YT](https://www.youtube.com/watch?v=egO4I2-BB6E)) · Guardian profile-interview 16 Jun 2021 ("People have a very limited understanding of the ghetto") · Korty EO (Apr 2026).
- **Do not add:** Colors Show, Sofar Sounds, Tiny Desk, Governor's Ball, Zane Lowe — zero evidence. "The Baddo Story" documentary does not exist.

---

## 7. Influence graph & impact map

### 7.1 Graph additions (all source-backed)

- **Dagrin** → Olamide, `inspired` — **the graph's biggest omission**. "I listen to Dagrin's album for inspiration," Olamide says ([Leadership](https://leadership.ng/i-listen-to-dagrins-album-for-inspiration-says-olamide/)); Dami Ajayi calls him "the most unlikely heir to Dagrin's template."
- **Naira Marley** — signed YBNL 2018, left May 2019 → Marlian ([BBC Pidgin](https://www.bbc.com/pidgin/53755188), [Wikipedia](https://en.wikipedia.org/wiki/Naira_Marley)). Also the honest context for "Gobe"/"Instagram".
- **Zlatan** ← Olamide, `inspired` — "How Olamide changed my life… like our own Jay-Z" ([WithinNigeria 2022](https://www.withinnigeria.com/entertainment/2022-05-01/how-olamide-changed-my-life-zlatan-ibile-opens-up-on-music-journey/)).
- **CKay, Rema, Bnxn already present (Bnxn) / add (CKay, Rema)** — *Unruly* collab edges.
- **Eskeez & P.Priime & Semzi (producers)** — produced UY Scuti-era through Kai!/Olamidé; label in-house-adjacent, not signees.
- **ID Cabasa edge gets a second dated moment:** "OK" on *Unfinished Business*, Dec 2025 — the Coded Tunes reunion.
- **Do NOT add:** Fela, Bala, Oniyule, OG Grandz, Tems — no interview/press link found. No existing edges need removal; all verified.

### 7.2 Impact-map corrections (file-verified)

- **C-5 · Port Harcourt** — blurb says "Phyno's city". **Wrong: Phyno is from Enugu.** Swap the claim to the Enugu pin or give PH its own evidence (none found). [Wikipedia: Phyno](https://en.wikipedia.org/wiki/Phyno).
- **C-6 · "OLIC / National Stadium" pin** (`olic-lagos`) — three errors to fix: (1) the series ran at **Eko Hotel (OLIC1 28 Dec 2014, OLIC2 27 Dec 2015, OLIC3 26 Dec 2016, OLIC5 23 Dec 2018)** and **Teslim Balogun Stadium, Surulere (OLIC4, 17 Dec 2017)** — never the National Stadium; (2) the "organisers projected a crowd near 25,000" line is unverified and contradicted — OLIC4 was noted for **low turnout** ([Nairaland](https://www.nairaland.com/4239155/olic4-low-turnout-dampens-expectation)); (3) coordinates should move to Teslim Balogun or split into two pins. ([TheNet](https://thenet.ng/2nd-edition-of-olamide-live-in-concert-to-hold-on-december-27/), [Impact Newspaper](https://www.theimpactnewspaper.com/2017-11-22/olamide-live-in-concert-4th-edition-holds-at-teslim-stadium-december-17/), [Guardian](https://guardian.ng/saturday-magazine/christmas-jamz-mega-shows-in-lagos-abuja/)).
- **C-7 · Ikeja blurb** ("radio/TV rooms") — replace with the documented **Mission 26K headline show, Police College Ikeja GRA, 1 Jan 2026 (~30k billed)**.
- **C-8 · London blurb** — currently vague; upgrade to the hard milestones: **OVO Wembley sell-out 23 Nov 2025 + O2 headline 25 Mar 2027**.

### 7.3 Impact-map additions

- **Bariga — street honour (Jul 2025):** Bariga LCDA renamed **Ajidagan St → "Olamide Adedeji (Baddo) Street"** and named the Charly Boy bus stop after him ([Guardian](https://guardian.ng/news/lagos-lcda-renames-street-after-sunny-ade-charly-boy-bus-stop-after-olamide/), [Vanguard](https://www.vanguardngr.com/2025/07/baddo-replaces-charly-boy-as-bariga-lcda-renames-streets-after-celebrities-politicians/)). A perfect archive moment — the map literally names a pin after the place that named a street after him. Also: the "Wo" video was shot in Bariga.
- **Ijebu-Ode (TASUED)** — the campus he dropped out of; origin-era pin.
- **Surulere (Teslim Balogun Stadium)** — split from the OLIC pin.
- **Ibadan** — add Glo Mega Music Show (UI campus) + the "Ibadan" song w/ Qdot.
- **Accra** — 2016 Ghana Meets Naija + "Wonders" with Shatta Wale at BF Suma's anniversary (video-sourced).
- **New York** — USA Culture Tour opener, 11 May 2018 (The NATIVE).
- **Abuja** — Kings Meet in Abuja, Apr 2018.
- **Weak evidence — hold or remove:** Paris (fan-clip only), Johannesburg (only Asake's JHB debut found — could reframe as a YBNL-satellite pin), Toronto (social-only Mission 26K reporting).

---

## 8. Snippets

17 audiogram entries (keyed by `quote`/`track`, all healthy). Natural additions from this research, one quote-line per already-verified track: "Durosoke" (2013), "Bobo" (2015), "Who You Epp?" (2016), "Wo" (2017), "First of All" (2012 — already in media), "Metaverse" (2024), "Kai!" (2025), "Burukutu" (2026 — "the 3 million for Ibadan / 500k UK" *Japa*-lyric line is documented as his lyric, useful as a quotable snippet). Any new snippet needs a Spotify track ID to match the existing shape.

---

## 9. Consolidated action matrix

| # | Priority | Action | Target file(s) |
|---|---|---|---|
| C-6 | **P0** | Fix OLIC pin (venues, drop 25k claim, coords) | `content/impact/places.json` |
| C-5 | P0 | Fix Port Harcourt "Phyno's city" | `content/impact/places.json` |
| A-1 | **P0** | Enroll *Time & Space* (announced; full add after 16 Nov) | `content/eras/legacy.mdx`, new `content/albums/time-and-space.mdx`, changelog |
| 6.1–6.2 | **P0** | Add ~30 missing videos 2018–2026 w/ directors | `content/media/media.json` |
| C-1 | P1 | 999 date 10 Feb → 9 Feb 2020 | `content/eras/reinvention.mdx` |
| C-2/C-3 | P1 | Kai! type snippet→single; "Welcome" id + duplicate | `content/songs/catalog.json` |
| A-4 | P1 | Add birthdate 15 Mar 1989; Wembley/O2/1B-streams/Power-Player beats | `content/biography/biography.mdx`, `content/eras/legacy.mdx` |
| C-4 | P1 | Asake exit (12 Feb 2025) wherever roster listed | biography/eras/label copy |
| 5.2 | P1 | 19 new slang terms; S-1…S-6 corrections | `content/slang/slang.json` |
| 7.1 | P2 | Dagrin, Naira Marley, Zlatan, CKay, Rema, Eskeez nodes; Cabasa 2025 edge | `content/influence/graph.json` |
| 7.3 | P2 | Bariga street rename, Ijebu-Ode, Surulere, Ikeja/Mission 26K, London upgrade | `content/impact/places.json` |
| 3.3 | P2 | Awards/milestones ledger into relevant era pages | `content/eras/*.mdx` |
| 8 | P2 | New snippet audiograms | `content/snippets/snippets.json` |

---

## 10. Reliability notes

- **Agent-vs-file adjudication:** the discography agent filed "corrections" for 2 Kings (2014), Lagos Nawa (2019), Carpe Diem (2010 mixtape), and a "missing Olamidé". Direct file reads proved the archive already had 2015 / 2017 / 2020 / Olamidé-2025. Those items were **not** real errors — caused by my deliberately rough briefing list. Everything else the agents flagged was file-verified before inclusion here.
- **Day-level source conflicts** (The Glory 23 vs 26 Dec, Carpe Diem 7 vs 8 Oct, Unruly 8 vs 9 Aug, Ikigai 26 vs 27 Jun, Olamidé 18 vs 19 Jun, Kai! 28 vs 29 Apr): archive works at year grain, so these are immaterial unless exact dates are added to frontmatter.
- **Unverified and deliberately excluded:** Maria Okanrende parentage, father's-death clickbait, CSQuid beef, "Modyn" feud, VEVO/Boomplay milestones, Colors/Tiny Desk/Sofar appearances, Magina/Everyday a Sunna dates, Wande Coal/Fireboy/Asake exact signing dates, pre-fame mixtape titles, "Young Erikina" etymology, "Baddo Sneh" origin, Motigbana/Wonma/Woske/Ilefo etymologies.
- **Wikipedia caveat:** the *Unruly* article carries an LLM-text maintenance banner (Jun 2026); its core facts here were cross-checked against TurnTable and awards coverage and held.
