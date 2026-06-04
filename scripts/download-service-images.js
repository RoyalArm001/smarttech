const fs = require("fs");
const path = require("path");
const https = require("https");

const outDir = path.resolve(__dirname, "../web/img/services");

const images = [
  { file: "systems_design.jpg", url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80" },
  { file: "technical_drawing.jpg", url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80" },
  { file: "equipment_supply.jpg", url: "https://images.pexels.com/photos/4481258/pexels-photo-4481258.jpeg?auto=compress&cs=tinysrgb&w=1600" },
  { file: "server_rack.jpg", url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80" },
  { file: "installation_works.jpg", url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1600&q=80" },
  { file: "cabling_installation.jpg", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80" },
  { file: "automation_cabinets.jpg", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80" },
  { file: "commissioning_programming.jpg", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80" },
  { file: "interfaces_ui.jpg", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80" },
  { file: "installation_surveillance_systems.jpg", url: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1600&q=80" },
  { file: "fire-security.jpg", url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1600&q=80" },
  { file: "fire_alarm_device.jpg", url: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1600" },
  { file: "installation_networks.jpg", url: "https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=1600" },
  { file: "electrical_installation_works.jpg", url: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1600" },
  { file: "smart_systems.jpg", url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600" },
  { file: "building_management_automation.jpg", url: "https://images.pexels.com/photos/37347/office-freelancer-computer-business-37347.jpeg?auto=compress&cs=tinysrgb&w=1600" },
  { file: "access_control_door.jpg", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80" },
  { file: "full_design_integrated.jpg", url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80" },
  { file: "audio_systems.jpg", url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1600&q=80" },
  { file: "wacker_installation.jpg", url: "https://images.pexels.com/photos/162553/pexels-photo-162553.jpeg?auto=compress&cs=tinysrgb&w=1600" },
  { file: "powder_coating.jpg", url: "https://images.pexels.com/photos/162625/welding-industrial-industry-162625.jpeg?auto=compress&cs=tinysrgb&w=1600" },
  { file: "bms_office.jpg", url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80" },
  { file: "surveillance_outdoor.jpg", url: "https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=1600" },
  { file: "surveillance_indoor.jpg", url: "https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=1600" },
  { file: "network_patch_panel.jpg", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80" }
];

function download(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { headers: { "User-Agent": "SmartTech-ImageSync/1.0" } }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        download(response.headers.location).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error("HTTP " + response.statusCode + " for " + url));
        return;
      }
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => resolve(Buffer.concat(chunks)));
      response.on("error", reject);
    });
    request.on("error", reject);
  });
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  let ok = 0;
  let fail = 0;
  for (const item of images) {
    const target = path.join(outDir, item.file);
    try {
      const buffer = await download(item.url);
      if (buffer.length < 8000) throw new Error("file too small");
      fs.writeFileSync(target, buffer);
      console.log("OK", item.file, buffer.length);
      ok += 1;
    } catch (error) {
      console.log("FAIL", item.file, error.message);
      fail += 1;
    }
  }
  console.log("Done:", ok, "ok,", fail, "failed");
  process.exit(fail > 0 ? 1 : 0);
})();
