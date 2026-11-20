GTA6Help.in — how to run and update your site
==============================================

WHAT'S HERE
  index.html          Home page
  missions.html       All 91 missions + progress tracker + missable missions
  guides.html         Beginner tips + money guide
  cheats.html         How cheats work + verified cheat table
  game-info.html      Release, platforms, editions, characters, FAQ
  assets/missions-data.js   <- EDIT THIS to add walkthrough text to missions
  assets/style.css    Colours and layout
  assets/site.js      Menu, footer, mission tracker (no need to touch)
  images/             Artwork and your screenshots

ADDING IMAGES (no coding)
  Capture your own screenshots in-game (PS5 Share button / Xbox Capture button)
  and save them with these exact names:
    images/missions/01.jpg ... images/missions/91.jpg  -> appear on each mission card
    images/home-feature.jpg   -> home page feature image
    images/guide-beginner.jpg -> guides page
    images/jason.jpg, images/lucia.jpg -> game info page
  Any slot without an image shows a "Screenshot coming soon" placeholder.
  Use your own gameplay captures. Don't copy Rockstar's official artwork or
  other sites' images: they're copyrighted.

ADDING A WALKTHROUGH
  Open assets/missions-data.js, find the mission, and type text into tips: "".

PUTTING IT ONLINE (free)
  Option A: Netlify Drop. Go to app.netlify.com/drop and drag this whole folder in.
  Option B: Vercel. Create a new project and upload this folder (no build settings needed).
  Then in the host's Domains settings add gta6help.in, and copy the DNS
  records it gives you into your domain registrar's DNS panel.

BUYING gta6help.in
  .in domains are sold by Indian registrars (e.g. GoDaddy India, BigRock,
  Hostinger, Namecheap). Usually a few hundred rupees for the first year.
