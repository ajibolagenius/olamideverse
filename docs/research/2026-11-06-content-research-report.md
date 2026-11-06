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

## 11. Prompt 21 continuation — implementation and verification

**6 November 2026.** Sections 1–10 are the original research baseline, not a
current implementation checklist. The user confirmed
[`prompt 21`](../prompts/21-research-report-gap-closure-awards-bio-quotes-albums-slang-media.md)
as the execution scope. Its source-verification requirement overrides inaccurate
claims in the baseline. Counts below were read from the resulting files.

### Scope disposition

| Prompt 21 item | Result |
|---|---|
| Awards in existing era moments | Headies 2015/2016 wins, MOBO 2016 nomination, The Glory's 2017 NEA win, Carpe Diem's 2022 Headies win, Grammy and NAACP nominations, Ikigai's 2024 AEA-USA win, and the 2025 Metaverse/Egwu result are present. Legacy moments are ordered chronologically. BET 2020 rejected; see evidence below. |
| Cîroc | Existing moment now says July 2013; exact day withheld because contemporary reporting predates 17 July. |
| Family prose | Biography names Ronke Osisanya Adedeji, TemmyGold and DJ Enimoney; acknowledges marriage to Adebukunmi Aisha Suleiman and fatherhood; connects the son credited as Milly to Billion Talk. No disputed parentage, marriage date, or expanded identification of minors. |
| Legacy commentary | Dami Ajayi's separately attributed short quotations and spelling critique are in the Olamidé story; Shallipopi's attributed description is in the existing Baddo entry; Cabasa's already-present recollection now identifies the May 2024 interview. |
| Eyán Mayweather | Display spelling updated throughout content and source. Album slug, song IDs and embeds are unchanged. A compatibility alias retains `moment-2-kings-eyan-mayweather`; all graph/map moment links resolve. |
| Album stories | Feature-free Eyán story/credits, attributed Carpe Diem 200M Spotify report, Ikigai AEA win and January 2025 vinyl context, Ọlámidé orthography note. Exact vinyl day/US exclusivity withheld. |
| Magina / Everyday a Sunna | Reinvention explicitly says the archive has not verified these releases and excludes them from its discography/count. No unverified release year or assertion that press reports have been found. |
| Slang and catalogue | **23** terms, including Who You Epp? and Shọ́rọ́ Níyẹn, both linked to existing song IDs. Catalogue title corrected; underlying Pidgin/Yoruba phrases are not claimed as inventions. |
| New media | **122** items: **+2** (Pulse's Headies footage and an official R70 Backstory excerpt). Two other proposed additions remain blocked by verification, below. |
| Director notes | **26** explicit `Dir.` credits; Reggae Blues = Adasa Cookey; Shoki remix = Unlimited L.A. Existing editorial context retained except documented factual corrections below. |
| CMS | `sync:audit-cms` and `seed:cms` executed; exact readback matched **5 eras, 7 albums, 122 media rows**. Existing status, cover path, updated-by values and media sort order preserved. |
| Draft protection | Time & Space remains `draft: true` in files and `status=draft` in CMS; local production route returns **404**. |
| Changelog | One entry added to the existing 6 November day in both changelogs. |
| Supporting fixes | Era headings derive the beat count from the moments array. Seed completion no longer prints admin credentials. No schema, dependencies, layout, or rendering/cache strategy changes. |

### Corrections to the research and initial scope assumptions

- **BET 2020:** Olamide is absent from the
  [official BET nominations](https://www.paramountpressexpress.com/bet/shows/the-bet-awards-2020/releases/?view=102500-bet-announces-official-nominations-for-the-bet-awards-2020).
  The proposed nomination is rejected, not an outstanding content task.
- **Shoki remix:** [NotJustOk's 7 July 2014 video announcement](https://notjustok.com/songs/videos/video-lil-kesh-shoki-remix-ft-davido-olamide/)
  credits Unlimited L.A; the prompt's TG Omori credit is wrong.
- **Cîroc:** [contemporary reporting dated 12 July 2013](https://36ng.ng/2013/07/12/olamide-becomes-first-nigerian-ambassador-for-ciroc/)
  already describes the deal. Use July, not an unsupported precise signing day.
- **Milly:** [The Lagos Review's 999 review](https://thelagosreview.ng/album-review-f9-for-olamides-999/)
  identifies the featured artist as Olamide's son. The baseline conflated the
  sons' names; the public biography uses only the artist credit Milly.
- **Ikigai vinyl:** [Kagoshima's ERE1064 listing](https://www.kagoshimarecords.com/release/33713379/olamide-ikigai-vol.-1)
  gives 30 January 2025 worldwide, while [Upcoming Vinyl](https://upcomingvinyl.com/record/olamide-ikigai-vol-1)
  gives 10 January. The story uses January 2025 and does not assert a universal US date.
- **Who You Epp?:** [contemporary Pulse coverage](https://www.pulse.ng/story/olamide-rappers-who-you-epp-is-nigerias-current-viral-drug-2024080517361124600)
  describes a variant of existing Pidgin. Popularization is supported; invention
  of the underlying expression is not.
- **Media note corrections:** [Jailer coverage](https://www.bellanaija.com/2021/09/olamide-jaywillz-jailer/)
  confirms Jaywillz, not the baseline's Bad Boy Timz caveat. Eru's note no longer
  assigns Bella Shmurda/Phyno guest vocals (the existing album track is solo).
  [Billionaires Club coverage](https://mp3bullet.ng/olamide-drops-star-studded-billionaires-club-video-featuring-wizkid-darkoo/)
  dates the video to 14 August 2025; [Luvaluvah coverage](https://jukeboxmusic.com.ng/olamide-releases-music-video-for-luvaluvah/)
  was already published 11 September 2025. Their notes were corrected accordingly.
- **Spotify editorial superlative:** excluded as prompt 21 specified; no new 2025
  award or milestone was inferred from the old profile wording.

### Additional source ledger for the implemented prose

- Awards: [MOBO's 2016 history](https://mobo.com/history/2016),
  [2017 NEA winners](https://36ng.ng/2017/11/27/davido-olamide-mayorkun-win-big-at-2017-nea-awards-full-list-of-winners/),
  [Recording Academy artist record](https://www.grammy.com/artists/olamide/54077/),
  [NAACP's 2024 nominations](https://naacp.org/articles/nominees-announced-55th-naacp-image-awards),
  [2024 AEA-USA results](https://musicinafrica.net/node/345440),
  [official 17th Headies results](https://theheadies.com/17th-headies-nominees-winners/).
- Family overview: [Olamide biography](https://en.wikipedia.org/wiki/Olamide),
  cross-checked separately against the Milly review above; disputed claims omitted.
- Commentary: [Dami Ajayi's NATIVE review, 4 July 2025](https://thenativemag.com/featured/review-olamides-olamide/),
  [Shallipopi / The Nation, 14 November 2024](https://thenationonlineng.net/olamide-king-of-nigerian-street-music-shallipopi/),
  [Cabasa / Daily Post, 16 May 2024](https://dailypost.ng/2024/05/16/why-i-cried-when-olamide-left-my-record-label-id-cabasa/).
- Albums: [feature-free Eyán announcement](https://www.thecable.ng/jega-song-olamides-new-album-eyan-mayweather/),
  [Carpe Diem's reported Spotify milestone](https://albumtalks.com/olamides-carpe-diem-surpasses-200-million-streams-on-spotify/).
- Slang: [The Cable's 2017 glossary](https://lifestyle.thecable.ng/pop-culture-slangs-olamide/)
  and the contemporary Pulse coverage above.

### Media verification and remaining gaps

| Candidate | Evidence and disposition |
|---|---|
| Headies dispute | `rqb_DX6PYHo`: YouTube oEmbed **200**, matching Pulse Nigeria title/uploader. Added as `live`, year **2016**, preserving the ceremony's “2015” name. |
| Backstory | `k8UYqdoFULk`: oEmbed **200**, matching R70 Television title/uploader. Added as an explicitly labelled documentary **excerpt uploaded in 2025**. The note distinguishes the 2021 premiere/2022 Netflix release; it does not claim this clip contains the dropout interview. |
| The AfroBeats Interviews | Supplied ID `egO4I2-BB6E`: oEmbed **401 Unauthorized**. No verifiable replacement found; not added. |
| Flytime 2025 | Concert reporting exists, but the candidate `XNknsGP1_c0` returned oEmbed **404** and its indexed upload date preceded the reported concert. Not added; the existing Flytime 2024 item remains. |

No guessed IDs, replacement concerts, hosted media or invented quotations were
used to fill these gaps. Chart fields/UI, Korty EO and Sotayo Gaga narrative beats,
general Gbedu/Shakara entries, unverified performances and a CMS caching redesign
remain **outside prompt 21**. The report as a whole is therefore not “all implemented.”

### Validation evidence

- `npx tsc --noEmit`: **exit 0**.
- `npm run lint`: **exit 0**, no warnings/errors.
- `npm run build`: **exit 0**, compiled successfully, **182/182** static pages
  generated. Build performed after the authorized generated fetch-cache purge.
- Direct Zod validation of file-backed eras, albums, biography, catalogue, slang,
  media, snippets, influence and impact passed independently of CMS fallback.
  Counts: **6 eras, 16 album files / 15 public, 23 terms, 122 media, 19 snippets**.
- Cross-reference checks: new slang carrier IDs exist; unique slang/media IDs;
  all graph/map moment fragments resolve; Time & Space draft retained.
- CMS readback: data/body matched the source files; prior publishing metadata
  preserved. Existing owner confirmed before seed; **0** users/settings/pages/
  polls/assets/slots inserted. Existing admin password was not changed.
- Local production server used **port 3112** because 3111 was occupied; the
  existing server was left running. Public route smoke checks returned 200 for
  the affected archive pages and 404 for `/albums/time-and-space`.
- Browser acceptance details are recorded below after the interactive pass.

No hosting deployment has been performed by this continuation. CMS changes are
live data; local production-build verification is not deployed-site verification.

### Browser closeout and known acceptance failure

- Chromium verified the new prose on the affected era, album and biography pages,
  the accented display title on `/` and `/albums`, the preserved moment fragment,
  the seven-beat headings and the page disclaimer.
- New Headies and Backstory embeds, plus Reggae Blues, actually played:
  embedded video elements reported `paused=false`, `readyState=4`, and nonzero
  `currentTime`. Reggae Blues displayed Adasa Cookey's credit.
- At **390 × 844**, the new Shọ́rọ́ Níyẹn entry rendered its diacritics, carrier
  footer and context without horizontal overflow. Screenshot inspected.
- At **1440 × 1000**, Act III's tour displayed Eyán Mayweather and its next step
  highlighted the existing media target. Layout/styles were not redesigned.
- Development smoke checks used the existing `next dev` server on **3001**:
  `/slang` and `/media` returned 200; `/albums/time-and-space` returned 404.
  A second dev launch was refused by Next.js's existing-server lock; no existing
  process was killed. Production browser checks used 3112.
- Browser console: the expected draft-route 404 plus existing DOM diagnostics
  about password inputs outside forms; no new runtime exception observed.
- **Failed acceptance step 5 — pre-existing Songs navigation bug:** both new
  “Song Dossier” links produce the expected `/songs?q=...` URL, but
  `src/components/SongCatalog.tsx` initializes query state to an empty string and
  never reads `q`. The catalogue therefore initially shows all records. Both
  carrier songs were verified by entering their titles into the search box.
  This was reproduced in Chromium and is not counted as a passing link test.
  Fixing query navigation is outside prompt 21's content-only/rendering boundary.
- Reproduction: open `/slang`, search “Who You Epp?”, click **Song Dossier**;
  observe the populated URL but empty Songs search box. Repeat for “Shọ́rọ́ Níyẹn”.
- Local evidence: `scripts/out/prompt-21/` (ignored) contains the CMS before
  snapshot/readback result, browser acceptance script and inspected mobile capture.
  No credentials are included in the report or captures.

**Closeout:** the verified content/CMS work is implemented; two media candidates
remain deliberately unseeded, unsupported source claims have explicit dispositions,
and the existing Songs query bug prevents marking every manual acceptance step
passed. No deployment or release acceptance is claimed.

## 12. Prompt 22 — remaining work and source corrections

The user approved `docs/prompts/22-research-outstanding-charts-biography-media-and-song-links.md`
after requesting the remaining work, changelogs and CMS sync. This section
supersedes section 11's Songs-query limitation and updates the media dispositions.

### Implementation

- `/songs?q=...` now synchronizes the search input on initial navigation and URL
  changes. A small Suspense-isolated URL reader preserves the static catalogue.
- Optional validated `chartPositions` metadata exists on tracks and songs. Album
  derivation and deduplication retain it without changing snippet record types.
  Both catalogue views show position kind, territory, date and a source link.
- Biography adds the Korty stage-anxiety account and the Sotayo Gaga screening
  statement. Both changelogs include the new work.
- Media now contains 124 entries: the official Korty interview and an audience
  excerpt of Olamide with Phyno at Flytime 2025 add two verified recordings.

### Chart evidence — historical observations, not undated lifetime claims

| Record | Published metadata | Source and qualification |
| --- | --- | --- |
| New Religion | Nigeria debut #2, as of 13 Jun 2023 | [TurnTable](https://www.turntablecharts.com/news/911) explicitly describes a debut; the UI does not relabel that as a proven lifetime peak. |
| Jinja | Nigeria peak #5, as of 22 Aug 2023 | [The NATIVE's contemporary chart report](https://thenativemag.com/turntable-top-100-olamide-jinja/) embeds TurnTable's announcement; [TurnTable's next report](https://www.turntablecharts.com/news/1046) confirms it remained at #5. |
| Gaza | Nigeria peak #10, as of 29 Aug 2023 | [TurnTable](https://www.turntablecharts.com/news/1046) explicitly describes a new peak. |
| Kai! | Nigeria peak #3, as of 13 May 2025 | [TurnTable](https://www.turntablecharts.com/news/1716) contradicts the original report's #9 peak claim. Do not copy that stale number. |
| Kai! | UK Afrobeats peak #7, as of 17 May 2025 | [Official Charts history](https://www.officialcharts.com/songs/olamide-wizkid-kai/) shows the first #7 week on that date. |
| Kai! | US Afrobeats peak #10, as of 13 Sep 2025 | [Readable reproduction of Billboard's dated chart](https://darkmode.wppool.dev/www.billboard.com/charts/billboard-u-s-afrobeats-songs/2025-09-13/) lists peak 10, first reached 17 May. [UKMIX's August transcription](https://www.ukmix.org/forum/chart-discussion/chart-analysis/11770247-us-billboard-charts-16-08-2025/page6) independently lists peak 10. Billboard's own page loaded its shell in Chromium but no chart rows; the UI links the readable reproduction rather than claiming the publisher page was verified directly. |

The `asOf` field dates the chart or cited report. It does not assert a current
position or a complete later chart history. No publisher API or scheduled chart
refresh has been introduced.

### Biography dates

- [Korty's official upload](https://www.youtube.com/watch?v=wbKkReO-qwI) is dated
  **3 August 2025**, also supported by [contemporary coverage](https://notjustok.com/news/olamide-opens-up-on-grief-growth-and-breaking-free-from-labels/amp/).
  [Daily Post's stage-anxiety story](https://dailypost.ng/2026/04/27/why-im-get-nervous-about-stage-performance-olamide/)
  was published **27 April 2026**. The biography distinguishes the original
  conversation from that later coverage, and paraphrases his own account without
  introducing a diagnosis.
- [The Guardian's screening report](https://guardian.ng/life/nigerian-culture-should-not-be-demonised-olamide/)
  was published **4 November 2026**. The biography dates the Sotayo Gaga screening
  to November and identifies 4 November as the report date, not the event date.

### Media verification and remaining restriction

- `wbKkReO-qwI`: matching YouTube oEmbed HTTP 200, channel **korty eo**. Local
  iframe playback observed `paused=false`, time 5.37 seconds, readyState 4.
- `SeJ5y_a3HDk`: matching oEmbed HTTP 200, **The Vagabond Creator**, titled
  “Olamide x Phyno Perform ‘Ghost Mode’ & ‘Fada Fada’ Live at Flytime Fest 2025”.
  Local iframe playback observed `paused=false`, time 5.14 seconds, readyState 4;
  the footage was visually inspected. The entry explicitly labels audience footage
  and Phyno. [Contemporary event coverage](https://afrobeatsglobal.com/olamide-flytime-fest-lagos-king-of-the-streets-shuts-down-day-2/)
  places the headline show and Phyno reunion on 23 December 2025. No claim is
  made that this excerpt contains Reminisce or the complete concert.
- The old Flytime candidate `XNknsGP1_c0` still returns oEmbed 404 and remains
  rejected; its indexed upload predates the show. A further working candidate
  `zkycD1jo-64` was found but was unnecessary once the Phyno excerpt was verified.
- **The AfroBeats Interviews remains unavailable for embedding.** YouTube search
  still lists `egO4I2-BB6E` under **R70 Television**, but oEmbed returns 401 and
  the actual embedded player states: “Playback on other websites has been disabled
  by the video owner.” The archive does not bypass that restriction or seed a
  nonworking player. This is the remaining provider limitation.
- Backstory remains its verified official excerpt. No full-film availability
  claim has been added. Prior rejected/unverified claims in sections 10–11 retain
  their dispositions.

### CMS and checks

- Completed targeted sync and CMS seed; readback at **2026-11-06 22:36:39 UTC**
  matched 5 eras, 8 albums and all 124 media records against local content.
  Existing status, cover paths, attribution and media sort order were preserved.
  `time-and-space` remains draft. The existing administrator was verified before
  seed; its password was left unchanged and no new account was created.
- Biography and song-catalogue JSON remain file-backed. Album-track charts live
  in the existing CMS album JSON; no database migration was needed.
- `npx tsc --noEmit`: exit 0. `npm run lint`: exit 0. An earlier lint invocation
  discovered that a temporary CJS check script hits an existing flat-config
  plugin mismatch; the evidence script was retained as `.cjs.txt` outside lint's
  code extensions, and the complete lint command then passed.
- `npm run check:embed-ids`: exit 0; Node emitted the existing module-type warning.
- Focused assertions passed: 708 file-backed songs, 685 after deduplication,
  4 chart-bearing records / 6 positions; invalid dates, positions and URL schemes
  rejected; evidence retained without input mutation; draft excluded.
- `npm run build`: exit 0, 182 pages. `/songs` remains prerendered static content.
  CMS fetch-cache was cleared before the post-sync build. No hosting deployment.
- Production browser verification is in progress; final results follow below.
