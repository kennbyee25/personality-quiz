# Bird Quiz — Salient Attributes (grounded in real bird data)

The point of the bird quiz isn't just flavor. Its personality "latent space" is
built on **axes that birders and datasets actually record** — so the vectors
aren't invented, they're grounded. This is the *"salient attributes" proof* for
the broader thesis: a classification set's vector space can be derived from real,
measurable data rather than hand-waved.

## Where the attributes come from

- **eBird checklists** (Cornell Lab of Ornithology) — the world's largest
  citizen-science bird dataset. Each record carries species, **counts** (→ flock
  size / sociality), **location** (→ habitat), **date & time** (→ seasonality /
  migration, and diurnal vs. nocturnal activity), and **breeding/behavior codes**
  (foraging, singing, flying, courtship display).
- **eBird Status & Trends** (modeled from eBird) — relative abundance and
  **seasonal range shifts** (→ migration distance / strategy), habitat
  associations.
- **AVONET** (Tobias et al., 2022) — morphology for every bird species: **body
  mass**, wing / beak / tail dimensions, hand-wing index (→ flight style, size,
  presence).
- **EltonTraits 1.0** (Wilman et al., 2014) — **diet and foraging niche**
  (predator, nectarivore, omnivore, grazer…).

## Salient axis → personality dimension

| Attribute axis | Recorded by | Maps to |
|---|---|---|
| Migration distance | eBird seasonality / Status & Trends | wandering ↔ rooted |
| Flock size | eBird counts | expressive/social ↔ solitary/independent |
| Diet / foraging | EltonTraits, behavior codes | fierce/bold (predator) … gentle (grazer) |
| Activity period | eBird time-of-day | nocturnal/mysterious ↔ diurnal |
| Body mass & flight style | AVONET | bold · fast · precise · enduring |
| Courtship / pair-bond | breeding codes | devoted · elegant |
| Vocal behavior | singing/behavior codes | expressive |

## The six archetypes (attribute profile → trait vector)

| Bird | Migration | Sociality | Diet | Activity | Flight | Pair-bond | → Traits |
|---|---|---|---|---|---|---|---|
| **Peregrine Falcon** | partial migrant | solitary | apex predator | diurnal | fastest stoop on Earth | seasonal | bold, fast, focused, fierce, decisive, independent |
| **Raven** | resident / dispersive | pairs + flocks | omnivore / scavenger | diurnal | agile, acrobatic | long-term | clever, curious, adaptable, playful, resourceful, expressive |
| **Owl** | mostly resident | solitary | ambush predator | **nocturnal** | silent | seasonal | wise, observant, patient, calm, mysterious, perceptive |
| **Hummingbird** | some long-distance | solitary / territorial | nectarivore | diurnal | hovering, highest wingbeat rate | brief | energetic, vibrant, restless, precise, spirited, territorial |
| **Albatross** | **transoceanic** | colonial nests / solo at sea | surface forager | diurnal | dynamic soaring, vast range | **lifelong** | wandering, independent, enduring, free, devoted, serene |
| **Swan** | partial migrant | pairs / family | grazing herbivore | diurnal | powerful, graceful | **lifelong monogamy** | elegant, graceful, devoted, poised, gentle, refined |

## Honest caveat

The trait *values* here are **illustrative** — derived from well-established
natural history plus the *kinds* of attributes the named datasets carry, not
computed from a live eBird/AVONET download. The proof being demonstrated is that
the **axes are real and data-backed**; turning them into *measured* vectors
(e.g., embedding AVONET rows, deriving sociality from eBird flock counts) is the
natural next step — and the geometry probe (MVP-1 in the big-bets writeup) that
would test whether such a space is "surprisingly complex."
