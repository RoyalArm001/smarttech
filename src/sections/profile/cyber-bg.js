(function () {
  "use strict";

  function initCyberBackground() {
    var canvas = document.getElementById("cyber-hacker-bg");
    if (!canvas) {
      var container = document.querySelector(".profile-section") || document.querySelector(".card") || document.body;
      if (!container) return;
      canvas = document.createElement("canvas");
      canvas.id = "cyber-hacker-bg";
      canvas.className = "cyber-hacker-bg";
      canvas.setAttribute("aria-hidden", "true");
      container.insertBefore(canvas, container.firstChild);
    }

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var width = 0;
    var height = 0;
    var dpr = 1;
    var animationFrameId = null;

    // Check prefers-reduced-motion
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    function resize() {
      var parent = canvas.parentElement || document.body;
      var rect = parent.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    window.addEventListener("resize", resize, { passive: true });
    resize();

    // Mouse tracking for interactive targeting
    var mouse = { x: -1000, y: -1000, active: false };
    var parentElem = canvas.parentElement || document.body;

    parentElem.addEventListener("mousemove", function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }, { passive: true });

    parentElem.addEventListener("mouseleave", function () {
      mouse.active = false;
    }, { passive: true });

    // --- Nodes & Network Grid ---
    var nodeCount = Math.min(Math.floor((width * height) / 9000), 55);
    nodeCount = Math.max(nodeCount, 25);
    var nodes = [];

    function createNodes() {
      nodes = [];
      for (var i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          radius: Math.random() * 2 + 1.5,
          color: Math.random() > 0.35 ? "#00f0ff" : (Math.random() > 0.5 ? "#00ff9d" : "#ff2e63"),
          pulse: Math.random() * Math.PI * 2,
          isServer: Math.random() < 0.15
        });
      }
    }
    createNodes();

    // --- Cyber Attack Packet Beams ---
    var beams = [];
    var sparks = [];
    var cyberChars = "0101010101ABCDEF01X79403DENIEDACCESSOKSECURE";

    function spawnAttackBeam() {
      if (nodes.length < 2) return;
      var srcIdx = Math.floor(Math.random() * nodes.length);
      var targetIdx = Math.floor(Math.random() * nodes.length);
      while (targetIdx === srcIdx) {
        targetIdx = Math.floor(Math.random() * nodes.length);
      }

      var src = nodes[srcIdx];
      var target = nodes[targetIdx];
      var isThreat = Math.random() > 0.4;

      beams.push({
        sx: src.x,
        sy: src.y,
        tx: target.x,
        ty: target.y,
        progress: 0,
        speed: 0.02 + Math.random() * 0.025,
        color: isThreat ? "#ff2e63" : "#00ff9d",
        label: isThreat ? "THREAT_" + Math.floor(Math.random() * 899 + 100) : "ALLOW_200",
        trail: []
      });
    }

    // --- Matrix Digital Streams ---
    var columnWidth = 24;
    var columns = Math.floor(width / columnWidth);
    var drops = [];
    for (var c = 0; c < columns; c++) {
      drops[c] = {
        y: Math.random() * -100,
        speed: 1.2 + Math.random() * 2,
        chars: []
      };
    }

    var lastBeamTime = 0;

    function render(timestamp) {
      ctx.clearRect(0, 0, width, height);

      // 1. Dark Gradient Cyber Background Overlay
      var bgGradient = ctx.createLinearGradient(0, 0, width, height);
      bgGradient.addColorStop(0, "rgba(5, 12, 20, 0.96)");
      bgGradient.addColorStop(0.5, "rgba(9, 21, 33, 0.94)");
      bgGradient.addColorStop(1, "rgba(4, 10, 16, 0.97)");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Cyber Grid Pattern
      ctx.strokeStyle = "rgba(0, 240, 255, 0.035)";
      ctx.lineWidth = 1;
      var gridSize = 40;
      ctx.beginPath();
      for (var gx = 0; gx < width; gx += gridSize) {
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
      }
      for (var gy = 0; gy < height; gy += gridSize) {
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
      }
      ctx.stroke();

      // 3. Matrix Digital Code Rain Streams (Subtle in Background)
      ctx.font = "11px monospace";
      for (var col = 0; col < columns; col += 2) {
        var drop = drops[col];
        if (!drop) continue;

        drop.y += drop.speed;
        if (drop.y > height + 50) {
          drop.y = Math.random() * -60;
          drop.speed = 1.2 + Math.random() * 2;
        }

        var charX = col * columnWidth + 6;
        var charY = drop.y;

        // Draw glowing head character
        var char = cyberChars.charAt(Math.floor(Math.random() * cyberChars.length));
        ctx.fillStyle = "rgba(0, 255, 157, 0.45)";
        ctx.fillText(char, charX, charY);

        // Draw subtle trailing char
        if (charY > 18) {
          ctx.fillStyle = "rgba(0, 240, 255, 0.15)";
          ctx.fillText(cyberChars.charAt(Math.floor(Math.random() * cyberChars.length)), charX, charY - 14);
        }
      }

      // 4. Update & Draw Nodes
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.04;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Draw connections between close nodes
        for (var j = i + 1; j < nodes.length; j++) {
          var n2 = nodes[j];
          var dx = n.x - n2.x;
          var dy = n.y - n2.y;
          var distSq = dx * dx + dy * dy;
          if (distSq < 130 * 130) {
            var alpha = (1 - Math.sqrt(distSq) / 130) * 0.22;
            ctx.strokeStyle = n.color === "#ff2e63" || n2.color === "#ff2e63"
              ? "rgba(255, 46, 99, " + alpha + ")"
              : "rgba(0, 240, 255, " + alpha + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }

        // Draw Node Point
        var currentRadius = n.radius + Math.sin(n.pulse) * 0.8;
        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(currentRadius, 1), 0, Math.PI * 2);
        ctx.fill();

        // Node Glow Ring for Servers
        if (n.isServer) {
          ctx.strokeStyle = n.color;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(n.x, n.y, currentRadius + 5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // 5. Spawn Cyber Attack Beams periodically
      if (timestamp - lastBeamTime > 1200) {
        spawnAttackBeam();
        if (Math.random() > 0.4) spawnAttackBeam();
        lastBeamTime = timestamp;
      }

      // 6. Draw & Update Attack Beams
      for (var b = beams.length - 1; b >= 0; b--) {
        var beam = beams[b];
        beam.progress += beam.speed;

        var currX = beam.sx + (beam.tx - beam.sx) * beam.progress;
        var currY = beam.sy + (beam.ty - beam.sy) * beam.progress;

        beam.trail.push({ x: currX, y: currY });
        if (beam.trail.length > 12) beam.trail.shift();

        // Draw Laser Trail
        if (beam.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(beam.trail[0].x, beam.trail[0].y);
          for (var t = 1; t < beam.trail.length; t++) {
            ctx.lineTo(beam.trail[t].x, beam.trail[t].y);
          }
          ctx.strokeStyle = beam.color;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Draw Packet Head
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(currX, currY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Label text near head
        ctx.font = "9px monospace";
        ctx.fillStyle = beam.color;
        ctx.fillText(beam.label, currX + 6, currY - 4);

        // When beam reaches target -> Spark explosion
        if (beam.progress >= 1) {
          for (var s = 0; s < 8; s++) {
            var angle = Math.random() * Math.PI * 2;
            var spd = 1 + Math.random() * 3;
            sparks.push({
              x: beam.tx,
              y: beam.ty,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd,
              life: 1,
              color: beam.color
            });
          }
          beams.splice(b, 1);
        }
      }

      // 7. Update & Draw Sparks
      for (var sp = sparks.length - 1; sp >= 0; sp--) {
        var spark = sparks[sp];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.life -= 0.04;

        if (spark.life <= 0) {
          sparks.splice(sp, 1);
          continue;
        }

        ctx.fillStyle = spark.color;
        ctx.globalAlpha = spark.life;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // 8. Interactive Mouse Cyber Reticle
      if (mouse.active) {
        ctx.strokeStyle = "rgba(0, 240, 255, 0.6)";
        ctx.lineWidth = 1.2;

        // Outer Reticle Ring
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 22, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(mouse.x - 28, mouse.y);
        ctx.lineTo(mouse.x - 14, mouse.y);
        ctx.moveTo(mouse.x + 14, mouse.y);
        ctx.lineTo(mouse.x + 28, mouse.y);
        ctx.moveTo(mouse.x, mouse.y - 28);
        ctx.lineTo(mouse.x, mouse.y - 14);
        ctx.moveTo(mouse.x, mouse.y + 14);
        ctx.lineTo(mouse.x, mouse.y + 28);
        ctx.stroke();

        // Connect nearby nodes to mouse
        for (var m = 0; m < nodes.length; m++) {
          var mn = nodes[m];
          var mdx = mouse.x - mn.x;
          var mdy = mouse.y - mn.y;
          var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 140) {
            ctx.strokeStyle = "rgba(0, 255, 157, " + (1 - mdist / 140) * 0.6 + ")";
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(mn.x, mn.y);
            ctx.stroke();
          }
        }
      }

      // 9. Cyber HUD Overlay Badges (Top corners)
      ctx.font = "10px monospace";
      ctx.fillStyle = "rgba(0, 240, 255, 0.55)";
      ctx.fillText("[SYSTEM: FIREWALL ACTIVE]", 16, 24);
      ctx.fillStyle = "rgba(0, 255, 157, 0.45)";
      ctx.fillText("LIVE THREAT MONITOR // 256-BIT ENCRYPTION", 16, 38);

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    // Pause animation when page tab is hidden
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        animationFrameId = requestAnimationFrame(render);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCyberBackground);
  } else {
    initCyberBackground();
  }
})();
