// Portfolio rendering + profile-aware chatbot. No API key required.
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl = (url) => /^https?:\/\//i.test(url || "") ? url : "";
function renderProfile(){
  $$("[data-profile]").forEach(el => {
    const key = el.dataset.profile;
    if (PROFILE[key] !== undefined) el.textContent = PROFILE[key];
  });
  $$("[data-profile-link]").forEach(el => {
    const key = el.dataset.profileLink, value = PROFILE[key] || "";
    if(key === "email"){ el.href = value.includes("@") && !value.includes("your.email") ? `mailto:${value}` : `mailto:${value}`; }
    else el.href = safeUrl(value) || "#";
  });
  $("#skillsGrid").innerHTML = PROFILE.skills.map(s => `<article class="skill-card"><div class="skill-icon">${esc(s.icon)}</div><h3>${esc(s.name)}</h3><p>${esc(s.note)} · ${esc(s.level)}</p></article>`).join("");
  $("#projectsGrid").innerHTML = PROFILE.projects.map(p => `<article class="project-card"><div class="project-art ${esc(p.theme)}"><div class="art-circle"></div><div class="art-window"><div class="art-bar"></div><div class="art-line"></div><div class="art-line short"></div><div class="art-line"></div></div></div><div class="project-body"><div class="project-top"><h3>${esc(p.name)}</h3><span class="project-number">${esc(p.number)}</span></div><p>${esc(p.description)}</p><div class="tags">${p.stack.map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</div>${safeUrl(p.link) ? `<a class="project-link" href="${esc(safeUrl(p.link))}" target="_blank" rel="noopener">View project ↗</a>` : `<span class="project-link" style="color:#858a99">${esc(p.linkLabel || "Repository link to be added")}</span>`}</div></article>`).join("");
  const links = [
    ["GH","GitHub","Code repositories and project work",PROFILE.github],
    ["in","LinkedIn","Professional profile and networking",PROFILE.linkedin],
    ["LC","LeetCode","Coding practice and problem solving",PROFILE.leetcode],
    ["HR","HackerRank","Programming practice and certificates",PROFILE.hackerrank]
  ].filter(item => safeUrl(item[3]));
  const extra = [
    ["ED","Education",PROFILE.education.map(e=>`${e.degree} — ${e.institution} (${e.period})${e.details ? `; ${e.details}` : ""}`).join("\\n")],
    ["✦","Certifications",PROFILE.certifications.join("\\n")],
    ["★","Achievements",PROFILE.achievements.join("\\n")]
  ];
  $("#profilesList").innerHTML = links.map(([sym,name,desc,url])=>`<a class="profile-link" href="${safeUrl(url)}" target="_blank" rel="noopener"><span class="profile-symbol">${sym}</span><span><strong>${name}</strong><small>${desc}</small></span><span class="profile-arrow">↗</span></a>`).join("") + extra.map(([sym,name,desc])=>`<div class="profile-link"><span class="profile-symbol">${sym}</span><span><strong>${name}</strong><small>${esc(desc).replace(/\\n/g," · ")}</small></span><span class="profile-arrow">✦</span></div>`).join("");
  const count = String(PROFILE.projects.length).padStart(2,"0");
  $$('[data-profile="projectCount"]').forEach(el=>el.textContent=count);
  $$('[data-profile="skillCount"]').forEach(el=>el.textContent=String(PROFILE.skills.length).padStart(2,"0")+"+");
  document.title = `${PROFILE.name} | Developer Portfolio`;
}
renderProfile();
$("#year").textContent = new Date().getFullYear();

$("#menuToggle").addEventListener("click",()=>$("#navLinks").classList.toggle("open"));
$$('#navLinks a').forEach(a=>a.addEventListener("click",()=>$("#navLinks").classList.remove("open")));

const panel=$("#chatPanel"), launcher=$("#chatLauncher"), messages=$("#chatMessages"), input=$("#chatInput");
function openChat(){panel.classList.add("open");panel.setAttribute("aria-hidden","false");setTimeout(()=>input.focus(),150)}
function closeChat(){panel.classList.remove("open");panel.setAttribute("aria-hidden","true")}
launcher.addEventListener("click",()=>panel.classList.contains("open")?closeChat():openChat());
$("#chatClose").addEventListener("click",closeChat);
function addMessage(text,who="bot",html=false){
  const div=document.createElement("div");div.className=`message ${who}`;
  if(html) div.innerHTML=text; else div.textContent=text;
  messages.appendChild(div);messages.scrollTop=messages.scrollHeight;
}
function profileSummary(){
 return `${PROFILE.name} is a ${PROFILE.degree.toLowerCase()} based in ${PROFILE.location}. ${PROFILE.tagline}`;
}
function answerQuestion(raw){
 const q=raw.toLowerCase();
 if(/^(hi|hello|hey|good morning|good evening)\b/.test(q)) return `Hi! 👋 I'm the portfolio assistant. Ask me about ${PROFILE.name}'s skills, projects, coding profiles, or resume.`;
 if(/resume|cv/.test(q)) return `You can view the resume from the Resume link in the top navigation, or open it here: <a href="assets/resume.pdf" target="_blank" rel="noopener">View resume ↗</a>\n\nRemember to replace assets/resume.pdf with your real resume before submitting.`;
 if(/project|built|work|portfolio/.test(q)){
   return `Here are the projects listed in ${PROFILE.name}'s portfolio:\n\n${PROFILE.projects.map((p,i)=>`${i+1}. ${p.name} — ${p.description}`).join("\n\n")}`;
 }
 if(/skill|technology|technologies|stack|know|programming language/.test(q)){
   return `The profile lists these skills and technologies:\n\n${PROFILE.skills.map(s=>`• ${s.name}: ${s.level} — ${s.note}`).join("\n")}\n\nSkill levels are editable in profile.js, so check that they accurately reflect the developer's experience.`;
 }
 if(/github|git hub|repository|repo/.test(q)) return safeUrl(PROFILE.github) ? `GitHub profile: <a href="${esc(safeUrl(PROFILE.github))}" target="_blank" rel="noopener">${esc(PROFILE.github)} ↗</a>` : "A GitHub profile URL was not included in the resume. Add your real URL to PROFILE.github in profile.js when ready.";
 if(/linkedin/.test(q)) return safeUrl(PROFILE.linkedin) ? `LinkedIn profile: <a href="${esc(safeUrl(PROFILE.linkedin))}" target="_blank" rel="noopener">Open LinkedIn ↗</a>` : "A LinkedIn URL was not included in the resume. Add your real URL to PROFILE.linkedin in profile.js when ready.";
 if(/leetcode|coding profile|hackerrank|codechef|coding platform/.test(q)){
   const arr=[["LeetCode",PROFILE.leetcode],["HackerRank",PROFILE.hackerrank]];
   return "Coding profiles:\n\n"+arr.map(([n,u])=>`• ${n}: ${u.includes("your-username")?"link not added yet":`<a href="${esc(safeUrl(u))}" target="_blank" rel="noopener">Open ${n} ↗</a>`}`).join("\n");
 }
 if(/contact|email|reach|connect/.test(q)) return `You can contact ${PROFILE.name} at ${esc(PROFILE.email)} or ${esc(PROFILE.phone)}.`;
 if(/about|who are you|introduce|background|yourself/.test(q)) return profileSummary()+"\n\n"+PROFILE.about;
 if(/interest|hobby|goal|currently|study|degree|college|education/.test(q)) return `Current focus: ${PROFILE.currently}.\nInterests: ${PROFILE.interests}.\nLocation: ${PROFILE.location}.\n\nAdd more education and experience details to profile.js for more specific answers.`;
 if(/thank/.test(q)) return "You're welcome! 😊 Feel free to ask about projects, skills, resume, or coding profiles.";
 return `I can answer questions about ${PROFILE.name}'s skills, projects, industrial training, education, certifications, achievements, resume, and contact details. Try asking: “Tell me about CodePulse AI”, “What certifications do you have?”, or “What was your industrial training experience?”`;
}
function submitQuestion(text){
 const value=(text||"").trim();if(!value)return;
 addMessage(value,"user");input.value="";
 const response=answerQuestion(value);
 const div=document.createElement("div");div.className="message bot";
 // Bot responses contain only escaped profile data and deliberately constructed safe links.
 div.innerHTML=esc(response).replace(/&lt;a href=&quot;([^&]*)&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot;&gt;([^]*?)&lt;\/a&gt;/g,
  (all,url,label)=>`<a href="${url.replace(/&amp;/g,'&')}" target="_blank" rel="noopener">${label}</a>`).replace(/\n/g,"<br>");
 messages.appendChild(div);messages.scrollTop=messages.scrollHeight;
}
$("#chatForm").addEventListener("submit",e=>{e.preventDefault();submitQuestion(input.value)});
$$(".suggestions button").forEach(btn=>btn.addEventListener("click",()=>{openChat();submitQuestion(btn.textContent)}));
addMessage(`Hi! I'm the portfolio assistant. Ask me anything about ${PROFILE.name}'s profile.`, "bot");
