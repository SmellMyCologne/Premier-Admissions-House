import type {
  StudentProfile,
  AnalysisResult,
  SchoolTier,
  EssayAngle,
  ActionItem,
} from '../types/assessment';

const ELITE_SCHOOLS = [
  'harvard', 'yale', 'princeton', 'stanford', 'mit', 'columbia',
  'upenn', 'penn', 'dartmouth', 'brown', 'cornell', 'duke',
  'caltech', 'uchicago', 'university of chicago', 'johns hopkins',
  'northwestern', 'rice', 'vanderbilt', 'notre dame', 'wash u',
  'washington university', 'georgetown', 'emory', 'carnegie mellon',
];

const COMPETITIVE_SCHOOLS = [
  'nyu', 'boston university', 'boston college', 'usc',
  'university of southern california', 'tufts', 'tulane',
  'georgia tech', 'unc', 'university of north carolina',
  'university of virginia', 'uva', 'william and mary',
  'university of michigan', 'umich', 'michigan',
  'ucla', 'uc berkeley', 'berkeley', 'ut austin',
  'university of texas', 'wisconsin', 'uiuc',
  'university of illinois', 'purdue', 'ohio state',
  'penn state', 'university of florida', 'uf',
  'university of georgia', 'uga', 'virginia tech',
  'university of washington', 'uw',
];

const ELITE_SCHOOL_PROFILES: Record<string, { avgGpa: string; avgSat: string; rate: string; known: string }> = {
  harvard: { avgGpa: '3.95+', avgSat: '1520-1580', rate: '3.4%', known: 'intellectual vitality, transformative leadership' },
  yale: { avgGpa: '3.95+', avgSat: '1510-1570', rate: '4.6%', known: 'interdisciplinary curiosity, community engagement' },
  princeton: { avgGpa: '3.95+', avgSat: '1510-1570', rate: '3.7%', known: 'independent scholarship, undergraduate research focus' },
  stanford: { avgGpa: '3.96+', avgSat: '1510-1570', rate: '3.7%', known: 'entrepreneurial drive, intellectual range' },
  mit: { avgGpa: '3.95+', avgSat: '1530-1580', rate: '3.9%', known: 'technical depth, collaborative problem-solving' },
  columbia: { avgGpa: '3.92+', avgSat: '1510-1560', rate: '3.9%', known: 'core curriculum engagement, urban intellectual life' },
  upenn: { avgGpa: '3.93+', avgSat: '1500-1560', rate: '5.9%', known: 'cross-school collaboration, applied knowledge' },
  penn: { avgGpa: '3.93+', avgSat: '1500-1560', rate: '5.9%', known: 'cross-school collaboration, applied knowledge' },
  dartmouth: { avgGpa: '3.92+', avgSat: '1490-1560', rate: '6.2%', known: 'outdoor leadership, close faculty mentorship' },
  brown: { avgGpa: '3.94+', avgSat: '1500-1560', rate: '5.1%', known: 'open curriculum, self-directed intellectual exploration' },
  cornell: { avgGpa: '3.90+', avgSat: '1480-1560', rate: '8.7%', known: 'college-specific fit, research university breadth' },
  duke: { avgGpa: '3.94+', avgSat: '1500-1560', rate: '5.0%', known: 'service leadership, athletics-academic balance' },
  caltech: { avgGpa: '3.97+', avgSat: '1550-1600', rate: '2.7%', known: 'STEM mastery, research intensity' },
  uchicago: { avgGpa: '3.95+', avgSat: '1510-1570', rate: '5.2%', known: 'intellectual unconventionality, rigorous discourse' },
  'university of chicago': { avgGpa: '3.95+', avgSat: '1510-1570', rate: '5.2%', known: 'intellectual unconventionality, rigorous discourse' },
  'johns hopkins': { avgGpa: '3.92+', avgSat: '1500-1560', rate: '6.5%', known: 'research depth, pre-professional achievement' },
  northwestern: { avgGpa: '3.92+', avgSat: '1490-1560', rate: '7.0%', known: 'multidisciplinary range, performance arts integration' },
  rice: { avgGpa: '3.92+', avgSat: '1490-1560', rate: '7.7%', known: 'residential college culture, collaborative ethos' },
  vanderbilt: { avgGpa: '3.90+', avgSat: '1480-1550', rate: '5.6%', known: 'interdisciplinary programs, Southern leadership tradition' },
  'notre dame': { avgGpa: '3.90+', avgSat: '1430-1540', rate: '11.9%', known: 'values-driven leadership, community identity' },
  'wash u': { avgGpa: '3.92+', avgSat: '1490-1560', rate: '11%', known: 'collaborative culture, undergraduate mentorship' },
  'washington university': { avgGpa: '3.92+', avgSat: '1490-1560', rate: '11%', known: 'collaborative culture, undergraduate mentorship' },
  georgetown: { avgGpa: '3.90+', avgSat: '1440-1540', rate: '12%', known: 'global affairs focus, service-oriented leadership' },
  emory: { avgGpa: '3.88+', avgSat: '1430-1530', rate: '11.4%', known: 'pre-health pipeline, community engagement' },
  'carnegie mellon': { avgGpa: '3.90+', avgSat: '1490-1560', rate: '11.1%', known: 'technical depth, interdisciplinary innovation' },
};

function parseGpa(raw: string): number {
  const num = parseFloat(raw);
  if (isNaN(num)) return 0;
  return Math.min(Math.max(num, 0), 5.0);
}

function parseSat(raw: string): { score: number; type: 'sat' | 'act' | 'none' } {
  if (!raw || raw.trim() === '') return { score: 0, type: 'none' };
  const num = parseInt(raw.replace(/[^0-9]/g, ''), 10);
  if (isNaN(num)) return { score: 0, type: 'none' };
  if (num <= 36) return { score: num, type: 'act' };
  return { score: num, type: 'sat' };
}

function normalizeTestScore(score: number, type: 'sat' | 'act' | 'none'): number {
  if (type === 'none') return 50;
  if (type === 'act') return Math.min((score / 36) * 100, 100);
  return Math.min((score / 1600) * 100, 100);
}

function categorizeSchools(raw: string) {
  const schools = raw.split(',').map((s) => s.trim()).filter(Boolean);
  const elite: string[] = [];
  const competitive: string[] = [];
  const other: string[] = [];

  for (const school of schools) {
    const lower = school.toLowerCase();
    if (ELITE_SCHOOLS.some((e) => lower.includes(e))) {
      elite.push(school);
    } else if (COMPETITIVE_SCHOOLS.some((c) => lower.includes(c))) {
      competitive.push(school);
    } else {
      other.push(school);
    }
  }

  return { elite, competitive, other };
}

function evaluateActivities(raw: string) {
  const lower = raw.toLowerCase();
  const hasLeadership = /captain|president|founder|leader|head|director|chair|editor.in.chief/i.test(lower);
  const hasResearch = /research|intern|lab|publish|paper|study/i.test(lower);
  const hasAwards = /award|honor|national|semifinal|finalist|winner|medal|recognition|merit|olympiad/i.test(lower);
  const hasCommunity = /volunteer|community|service|nonprofit|mentor|tutor|hospital/i.test(lower);
  const hasArts = /music|art|theater|theatre|dance|film|orchestra|band|choir|creative writing|photography/i.test(lower);
  const hasAthletics = /varsity|captain|team|swim|track|soccer|basketball|football|lacrosse|tennis|rowing|cross country/i.test(lower);
  const hasEntrepreneurship = /founder|start|business|company|launch|app|website|sold|revenue|client/i.test(lower);

  const activityList = raw.split(',').map((s) => s.trim()).filter(Boolean);
  const depth = Math.min(activityList.length, 8);

  let score = 30;
  if (hasLeadership) score += 20;
  if (hasResearch) score += 15;
  if (hasAwards) score += 20;
  if (hasCommunity) score += 10;
  score += Math.min(depth * 2, 10);

  return {
    score: Math.min(score, 100),
    hasLeadership,
    hasResearch,
    hasAwards,
    hasCommunity,
    hasArts,
    hasAthletics,
    hasEntrepreneurship,
    depth,
    activities: activityList,
  };
}

function getSchoolKey(school: string): string | null {
  const lower = school.toLowerCase();
  for (const key of Object.keys(ELITE_SCHOOL_PROFILES)) {
    if (lower.includes(key)) return key;
  }
  return null;
}

function buildPositioning(
  schools: { elite: string[]; competitive: string[]; other: string[] },
  clampedScore: number,
): string {
  const allSchools = [...schools.elite, ...schools.competitive, ...schools.other];
  let positioning = '';

  if (schools.elite.length > 0) {
    const reachLabel = clampedScore < 70 ? 'Strong Reach' : 'Reach';
    positioning += `REACH: ${schools.elite.join(', ')} -- ${reachLabel}. `;
    if (clampedScore < 55) {
      positioning += 'With your current profile, these schools represent a significant stretch. Acceptance at this level typically requires a GPA above 3.9, test scores in the 99th percentile, and nationally recognized extracurricular achievement. ';
    } else if (clampedScore < 75) {
      positioning += 'You have a competitive foundation, but these schools remain highly selective with acceptance rates under 10%. Strengthening your profile in key areas will be important. ';
    } else {
      positioning += 'Your profile aligns well with the academic expectations at this level, though admissions at these schools is never certain given single-digit acceptance rates. ';
    }
  }

  if (schools.competitive.length > 0) {
    const compLabel = clampedScore >= 70 ? 'Target' : clampedScore >= 50 ? 'Target/Reach' : 'Reach';
    positioning += `\n\n${compLabel.toUpperCase()}: ${schools.competitive.join(', ')}. `;
    positioning += `Based on your academic indicators, these schools fall in your ${compLabel.toLowerCase()} range. `;
    if (clampedScore >= 70) {
      positioning += 'Your GPA and extracurricular profile should meet their general thresholds, though strong essays and recommendations will differentiate you.';
    } else {
      positioning += 'Focus on strengthening test scores and showcasing leadership to improve your odds here.';
    }
  }

  if (schools.other.length > 0) {
    const safeLabel = clampedScore >= 60 ? 'Safety/Target' : 'Target';
    positioning += `\n\n${safeLabel.toUpperCase()}: ${schools.other.join(', ')}. `;
    positioning += 'These schools provide solid options where your profile is likely competitive.';
  }

  if (allSchools.length === 0) {
    positioning = 'No specific schools were identified. Consider building a balanced list with 2-3 reach schools, 3-4 target schools, and 2-3 safety schools based on your academic profile.';
  }

  return positioning.trim();
}

function buildWeaknesses(
  gpa: number,
  testScore: number,
  testType: 'sat' | 'act' | 'none',
  activities: ReturnType<typeof evaluateActivities>,
  schools: { elite: string[] },
): string[] {
  const weaknesses: string[] = [];

  if (gpa < 3.5) {
    weaknesses.push(`Your GPA of ${gpa.toFixed(2)} is below the typical threshold for highly selective schools (3.8+). If your school offers a rigorous curriculum, an upward trend in grades could partially offset this, but this is a significant gap to address.`);
  } else if (gpa < 3.8) {
    weaknesses.push(`Your GPA of ${gpa.toFixed(2)} is solid but not at the level most competitive applicants present (3.9+). An upward trajectory in junior and senior year coursework would strengthen your academic narrative.`);
  }

  if (testType === 'none') {
    weaknesses.push('No standardized test score was provided. While many schools are test-optional, a strong SAT (1450+) or ACT (32+) score can meaningfully strengthen your application, especially for reach schools. Consider whether submitting a score would help or hurt your candidacy.');
  } else if (testType === 'sat' && testScore < 1400) {
    weaknesses.push(`An SAT score of ${testScore} places you below the median for competitive schools (1450-1550 range). Retaking the test or switching to the ACT could yield a better result if you prepare strategically.`);
  } else if (testType === 'act' && testScore < 31) {
    weaknesses.push(`An ACT score of ${testScore} is below the typical range for top-tier applicants (33-36). Targeted preparation on your weakest sections could raise this significantly.`);
  }

  if (!activities.hasLeadership) {
    weaknesses.push('Your extracurricular profile lacks clear leadership positions. Admissions officers look for evidence that you can lead, not just participate. Seek president, captain, or founder roles in organizations aligned with your interests.');
  }

  if (!activities.hasResearch && schools.elite.length > 0) {
    weaknesses.push('For elite university targets, research experience or intellectual depth beyond coursework is often expected. Consider pursuing a summer research position, independent project, or academic competition to demonstrate intellectual curiosity.');
  }

  if (!activities.hasAwards) {
    weaknesses.push('Your profile does not mention awards or competitive recognitions. Selective schools favor applicants with tangible achievements -- regional or national honors, competition results, or published work that validates your abilities.');
  }

  if (activities.depth < 3) {
    weaknesses.push('Your activity list appears thin. Selective schools want to see 2-3 deeply committed pursuits rather than a long list of surface-level involvement. Focus on depth and impact in a few key areas.');
  }

  while (weaknesses.length < 3) {
    if (!weaknesses.some((w) => w.includes('essay'))) {
      weaknesses.push('Without seeing your essays, this is a potential area of concern. Your personal statement must go beyond accomplishments and reveal genuine self-awareness, vulnerability, or intellectual passion. Generic essays are the most common reason strong-on-paper applicants get rejected.');
    } else if (!weaknesses.some((w) => w.includes('recommendation'))) {
      weaknesses.push('Recommendations are a hidden differentiator. Ensure your recommenders can speak to specific moments of growth, intellectual engagement, or character -- not just confirm that you got an A in their class.');
    } else {
      weaknesses.push('Consider the overall narrative cohesion of your application. Each component -- activities, essays, recommendations -- should reinforce a clear, authentic theme about who you are and what drives you.');
    }
  }

  return weaknesses.slice(0, 3);
}

function buildImprovements(
  gpa: number,
  gradeLevel: string,
  testScore: number,
  testType: 'sat' | 'act' | 'none',
  activities: ReturnType<typeof evaluateActivities>,
  schools: { elite: string[] },
): string[] {
  const improvements: string[] = [];

  if (gpa < 3.9 && gradeLevel !== '12th Grade') {
    improvements.push('Prioritize academic rigor this semester. Take the most challenging courses available (AP/IB/Honors) and aim for an upward GPA trend. A visible improvement in academic intensity signals motivation and growth potential to admissions committees.');
  }

  if (testType === 'none' || (testType === 'sat' && testScore < 1500) || (testType === 'act' && testScore < 33)) {
    improvements.push(`Invest in targeted test preparation. ${testType === 'none' ? 'Take a diagnostic SAT and ACT to determine which format suits you better, then' : 'Identify your weakest sections and'} commit to a 6-8 week structured prep plan. A 50-100 point SAT improvement or 2-3 point ACT jump is achievable and can meaningfully shift your positioning.`);
  }

  if (!activities.hasLeadership) {
    improvements.push('Pursue a leadership position in your strongest extracurricular area before applications are due. If elected roles are not available, create your own initiative -- start a project, organize an event, or launch a community effort that demonstrates your capacity to lead and create impact.');
  }

  if (!activities.hasResearch && schools.elite.length > 0) {
    improvements.push('Seek a research or intellectual project that connects to your intended area of study. Reach out to local university professors, apply to summer research programs, or design an independent study. This demonstrates the kind of intellectual depth elite schools value most.');
  }

  if (activities.hasLeadership && activities.hasResearch) {
    improvements.push('Deepen your existing strengths by documenting measurable impact. Instead of listing activities, quantify results: "Grew membership by 40%," "Published findings in X," "Raised $5,000 for Y." Numbers make your contributions concrete and memorable.');
  }

  while (improvements.length < 3) {
    if (!improvements.some((i) => i.includes('essay'))) {
      improvements.push('Begin your personal statement early and iterate aggressively. Write at least 5 drafts with fundamentally different angles before committing to a direction. The best essays are not about the most impressive topic -- they are about the most revealing insight. Seek feedback from people who know you well, not just those who write well.');
    } else if (!improvements.some((i) => i.includes('school list'))) {
      improvements.push('Refine your school list to ensure strategic balance. You should have 2-3 genuine safety schools where your stats exceed the 75th percentile, 3-4 target schools where you are at or above median, and 2-4 reach schools. Each school on your list should have a specific, articulable reason beyond ranking.');
    } else {
      improvements.push('Build authentic connections with your target schools through demonstrated interest: attend information sessions, reach out to current students or professors in your area of interest, and reference specific programs or opportunities in your supplemental essays.');
    }
  }

  return improvements.slice(0, 3);
}

function buildEssayAngle(activities: ReturnType<typeof evaluateActivities>): string {
  if (activities.hasResearch && activities.hasLeadership) {
    return 'Your profile suggests someone who both explores ideas deeply and mobilizes others. Consider an essay that traces a specific moment where intellectual curiosity led you to take action -- perhaps a research finding that prompted you to start something, or a leadership challenge that forced you to think differently. The strongest angle would show the tension between these two sides of your identity and how they ultimately reinforce each other.';
  }
  if (activities.hasResearch) {
    return 'Your research experience provides strong material for an essay about intellectual discovery. Rather than describing what you studied, focus on a moment of genuine surprise -- a result you did not expect, a question that changed your understanding, or a failure that taught you something important. Show admissions readers how you think, not just what you know.';
  }
  if (activities.hasLeadership) {
    return 'Your leadership experience is a natural essay foundation, but avoid the common trap of writing about "learning to lead." Instead, consider a moment where your leadership was tested -- a decision you were unsure about, a conflict you navigated, or a time you had to admit you were wrong. Vulnerability and self-awareness make leadership essays compelling.';
  }
  if (activities.hasCommunity) {
    return 'Your community involvement suggests genuine empathy and initiative. The strongest essay angle here would avoid the "I helped others and learned from it" template. Instead, focus on a specific relationship, a moment of discomfort, or an observation that changed how you see the world. Show that your service is driven by something personal, not performative.';
  }
  return 'Without a dominant extracurricular theme, your essay has the freedom to reveal something unexpected about you. Consider writing about a quiet obsession, an unconventional interest, or a formative experience that does not appear anywhere else in your application. The best essays for profiles like yours are the ones that make the reader say "I would not have guessed that about this person." Authenticity and specificity matter more than topic prestige.';
}

function buildSchoolTiers(
  schools: { elite: string[]; competitive: string[]; other: string[] },
  clampedScore: number,
  gpa: number,
  testScore: number,
  testType: 'sat' | 'act' | 'none',
  activities: ReturnType<typeof evaluateActivities>,
): SchoolTier[] {
  const tiers: SchoolTier[] = [];
  const testLabel = testType === 'none'
    ? 'no test score submitted'
    : testType === 'sat'
      ? `an SAT of ${testScore}`
      : `an ACT of ${testScore}`;

  for (const name of schools.elite) {
    const key = getSchoolKey(name);
    const profile = key ? ELITE_SCHOOL_PROFILES[key] : null;

    let rationale: string;
    if (profile) {
      const gpaGap = gpa < parseFloat(profile.avgGpa) ? `Your ${gpa.toFixed(2)} GPA falls below their median of ${profile.avgGpa}.` : `Your ${gpa.toFixed(2)} GPA is competitive with their median of ${profile.avgGpa}.`;
      rationale = `${name} admits at a ${profile.rate} rate and is known for valuing ${profile.known}. ${gpaGap} With ${testLabel}, `;
      if (clampedScore >= 75) {
        rationale += `you have the statistical foundation to compete here, but at ${profile.rate} acceptance, execution on essays and demonstrated fit with their specific culture is decisive.`;
      } else if (clampedScore >= 55) {
        rationale += `you will need to differentiate on non-academic dimensions. Their typical admitted student presents ${profile.avgSat} and strong evidence of ${profile.known}.`;
      } else {
        rationale += `there is a substantial gap between your current profile and their admitted student range (${profile.avgSat}, ${profile.avgGpa} GPA). This is a long-shot unless you have extraordinary circumstances or hooks.`;
      }
    } else {
      rationale = clampedScore >= 75
        ? 'Your academic indicators are competitive for this tier, but single-digit acceptance rates mean strong essays and demonstrated fit are essential.'
        : 'Significant strengthening of your academic and extracurricular profile would be needed to compete at this level.';
    }

    tiers.push({
      name,
      category: 'reach',
      note: clampedScore >= 75
        ? 'Competitive but uncertain at this selectivity level.'
        : clampedScore >= 55
          ? 'Requires meaningful profile strengthening.'
          : 'Significant gap with typical admitted student.',
      rationale,
    });
  }

  for (const name of schools.competitive) {
    const cat = clampedScore >= 70 ? 'target' : clampedScore >= 50 ? 'target' : 'reach';
    const rationale = cat === 'target'
      ? `Your ${gpa.toFixed(2)} GPA and extracurricular depth place you within the competitive range for ${name}. The differentiator here will be your supplemental essays and how well you articulate why this specific school fits your goals. Strong demonstrated interest matters at this tier.`
      : `At your current profile strength, ${name} is a stretch. Focus on presenting a compelling narrative in your essays and securing strong recommendations that speak to your trajectory and potential, not just your current numbers.`;

    tiers.push({
      name,
      category: cat,
      note: cat === 'target'
        ? 'Academic indicators align with admitted student profiles.'
        : 'Strengthening test scores and activities would improve positioning.',
      rationale,
    });
  }

  for (const name of schools.other) {
    const cat = clampedScore >= 60 ? 'safety' : 'target';
    const rationale = cat === 'safety'
      ? `Your academic profile exceeds the typical admitted student range at ${name}. This is a strong safety option -- but do not treat it dismissively in your application. Admissions officers can detect when a candidate views their school as a backup. Write a genuine supplemental essay that shows specific knowledge of their programs.`
      : `${name} is competitive for your profile. A well-executed application with genuine demonstrated interest should position you well here.`;

    tiers.push({
      name,
      category: cat,
      note: cat === 'safety'
        ? 'Strong likelihood of admission.'
        : 'Competitive candidate; focus on supplemental essays.',
      rationale,
    });
  }

  return tiers;
}

function buildProfileSummary(
  gpa: number,
  testScore: number,
  testType: 'sat' | 'act' | 'none',
  activities: ReturnType<typeof evaluateActivities>,
  strengthScore: number,
): string {
  const level = strengthScore >= 75
    ? 'strong'
    : strengthScore >= 55
      ? 'developing'
      : 'early-stage';

  const testLabel = testType === 'none'
    ? 'no standardized test score on file'
    : testType === 'sat'
      ? `an SAT of ${testScore}`
      : `an ACT of ${testScore}`;

  const activityHighlights: string[] = [];
  if (activities.hasLeadership) activityHighlights.push('leadership experience');
  if (activities.hasResearch) activityHighlights.push('research involvement');
  if (activities.hasAwards) activityHighlights.push('competitive recognitions');
  if (activities.hasCommunity) activityHighlights.push('community engagement');

  const actLabel = activityHighlights.length > 0
    ? activityHighlights.join(', ')
    : 'limited documented extracurricular depth';

  return `This is a ${level} admissions profile. The candidate presents a ${gpa.toFixed(2)} GPA, ${testLabel}, and ${actLabel}. The overall strength score of ${strengthScore}/100 reflects the candidate's current competitiveness across academic, extracurricular, and strategic dimensions.`;
}

function buildExecutiveRead(
  gpa: number,
  testScore: number,
  testType: 'sat' | 'act' | 'none',
  activities: ReturnType<typeof evaluateActivities>,
  schools: { elite: string[]; competitive: string[]; other: string[] },
  strengthScore: number,
  gradeLevel: string,
): string {
  const allSchools = [...schools.elite, ...schools.competitive, ...schools.other];
  const testLabel = testType === 'none'
    ? 'no test score on file'
    : testType === 'sat'
      ? `a ${testScore} SAT`
      : `a ${testScore} ACT`;

  const targetingElite = schools.elite.length > 0;
  const eliteNames = schools.elite.slice(0, 3).join(', ');

  let read = `Candidate presents as a ${gradeLevel.toLowerCase()} student with a ${gpa.toFixed(2)} GPA and ${testLabel}. `;

  if (targetingElite) {
    if (strengthScore >= 75) {
      read += `The academic foundation is competitive for ${eliteNames}, though at current acceptance rates, no applicant is safe. The critical question for this candidacy is not whether the numbers qualify -- they do -- but whether the application narrative is distinctive enough to survive committee review. `;
      read += `In a pool where 80% of applicants have comparable or better stats, the deciding factors will be essay voice, recommendation specificity, and demonstrated intellectual identity. `;
    } else if (strengthScore >= 55) {
      read += `This candidate is targeting ${eliteNames} -- schools where the median admit presents materially stronger academics. This is not disqualifying, but it means the non-academic dimensions of the application must carry disproportionate weight. `;
      read += `The extracurricular profile ${activities.hasLeadership ? 'shows leadership potential' : 'lacks clear leadership evidence'}, and ${activities.hasResearch ? 'research experience adds depth' : 'the absence of research or intellectual projects leaves a gap that elite school readers will notice'}. `;
    } else {
      read += `Candidly, ${eliteNames} represent a significant stretch given current indicators. The GPA gap alone (${gpa.toFixed(2)} vs. the 3.9+ typically expected) creates a headwind that would require extraordinary compensating factors -- a nationally ranked talent, first-generation or underrepresented status, or a personal narrative of unusual power. `;
      read += `This does not mean these schools should be abandoned entirely, but the application strategy should not depend on them. `;
    }
  } else if (schools.competitive.length > 0) {
    if (strengthScore >= 70) {
      read += `The candidate is well-positioned for their target tier. The academic indicators are within range, and the key variable will be application execution -- particularly essay quality and school-specific fit. `;
    } else {
      read += `The target schools are aspirational but achievable with strategic application execution. Test preparation and extracurricular development in the coming months could meaningfully shift this positioning. `;
    }
  }

  if (allSchools.length === 0) {
    read += 'No target schools were specified. Building a strategic school list should be an immediate priority. ';
  }

  const narrativeStrength = [activities.hasLeadership, activities.hasResearch, activities.hasAwards, activities.hasCommunity].filter(Boolean).length;
  if (narrativeStrength >= 3) {
    read += 'The extracurricular profile has the ingredients for a coherent narrative -- the challenge will be selecting which thread to elevate rather than trying to showcase everything.';
  } else if (narrativeStrength >= 1) {
    read += `There are ${narrativeStrength === 1 ? 'early signs of' : 'building blocks for'} a differentiating narrative, but the application will need to connect these threads into a cohesive identity that readers remember after reviewing hundreds of folders.`;
  } else {
    read += 'The extracurricular profile needs significant development before it can support a compelling application narrative. This is the single highest-leverage area for improvement.';
  }

  return read.trim();
}

function buildCoreStrengths(
  gpa: number,
  testScore: number,
  testType: 'sat' | 'act' | 'none',
  activities: ReturnType<typeof evaluateActivities>,
  strengthScore: number,
): string[] {
  const strengths: string[] = [];

  if (gpa >= 3.9) {
    strengths.push(`A ${gpa.toFixed(2)} GPA signals consistent academic performance at a high level. This is one of the strongest indicators in any application because it reflects sustained effort over years, not a single test day. Admissions committees will view this as evidence of discipline, intellectual engagement, and reliability -- qualities that predict success in a rigorous undergraduate environment.`);
  } else if (gpa >= 3.7) {
    strengths.push(`Your ${gpa.toFixed(2)} GPA demonstrates solid academic commitment. While not at the very top of competitive applicant pools, it shows that you can handle rigorous coursework consistently. If your transcript shows an upward trend or particularly strong performance in AP/IB courses, this strengthens the signal further.`);
  } else if (gpa >= 3.5) {
    strengths.push(`Your ${gpa.toFixed(2)} GPA, while not in the top tier, demonstrates competence and consistency. If this GPA was earned in a particularly rigorous courseload (multiple APs, IB Diploma, etc.), it carries more weight than its numerical value suggests. Context matters -- admissions officers read transcripts, not just numbers.`);
  }

  if (testType === 'sat' && testScore >= 1500) {
    strengths.push(`A ${testScore} SAT places you in the 98th+ percentile nationally. This score eliminates standardized testing as a liability and positions you competitively even at the most selective institutions. Do not retake unless you are confident of a meaningful jump -- a ${testScore} is already well above the threshold where additional points yield diminishing returns.`);
  } else if (testType === 'act' && testScore >= 33) {
    strengths.push(`A ${testScore} ACT places you in the top 1-2% of test-takers nationally. This is a genuine asset in your application and eliminates testing as a point of concern. At this level, the score speaks for itself and your energy is better spent on other application components.`);
  } else if (testType === 'sat' && testScore >= 1400) {
    strengths.push(`Your ${testScore} SAT is a solid foundation. While there is room for improvement for the most selective schools, this score will not hold you back at the majority of competitive institutions. It demonstrates strong baseline aptitude.`);
  } else if (testType === 'act' && testScore >= 31) {
    strengths.push(`Your ${testScore} ACT demonstrates strong academic aptitude and will serve you well across most of your target schools. For reach schools, a 1-2 point improvement could move you into the "no concerns" range.`);
  }

  if (activities.hasLeadership) {
    strengths.push(`Your leadership experience is a meaningful differentiator. Admissions officers distinguish between "members" and "leaders" -- and you fall on the right side of that line. The key is to ensure your application conveys not just the title but the impact: decisions you made, people you influenced, problems you solved. A president who transformed a club is more compelling than one who merely presided over meetings.`);
  }

  if (activities.hasResearch) {
    strengths.push('Research or intellectual work beyond the classroom signals the kind of curiosity that selective schools actively seek. This is particularly valuable because it demonstrates self-direction -- you pursued knowledge not because it was assigned, but because you wanted to understand something. Frame this experience in terms of questions and discoveries, not just methods and results.');
  }

  if (activities.hasAwards) {
    strengths.push('Competitive recognitions provide external validation that is difficult to manufacture. Awards, honors, and competition results give admissions committees a calibration point -- they can assess your achievement relative to a broader population, not just your school. Make sure your application highlights these clearly, with context about selectivity or significance.');
  }

  if (activities.hasCommunity) {
    strengths.push('Sustained community engagement demonstrates values and empathy -- qualities that admissions committees increasingly prioritize. The strongest applications show service that is connected to the candidate\'s broader identity, not a checkbox exercise. If your community work relates to your academic interests or personal story, make that connection explicit.');
  }

  if (activities.hasEntrepreneurship) {
    strengths.push('Entrepreneurial initiative is one of the most compelling signals a young applicant can present. Starting something from nothing -- whether a business, organization, or project -- demonstrates agency, risk tolerance, and execution ability. These are rare qualities at any age, and admissions officers recognize them immediately.');
  }

  if (strengths.length === 0) {
    strengths.push('Your willingness to assess your profile and seek strategic guidance is itself a positive signal. Many applicants apply without self-awareness about their positioning. The fact that you are evaluating your candidacy critically gives you an advantage in crafting a more intentional, targeted application.');
  }

  return strengths.slice(0, 4);
}

function buildCriticalLiabilities(
  gpa: number,
  testScore: number,
  testType: 'sat' | 'act' | 'none',
  activities: ReturnType<typeof evaluateActivities>,
  schools: { elite: string[]; competitive: string[] },
  gradeLevel: string,
): string[] {
  const liabilities: string[] = [];
  const targetingElite = schools.elite.length > 0;

  if (gpa < 3.5 && targetingElite) {
    liabilities.push(`GPA liability is severe. At ${gpa.toFixed(2)}, your transcript will likely be flagged in the first read at any school with a sub-15% acceptance rate. Academic Review committees at schools like ${schools.elite[0]} will need a compelling reason to advocate past this number -- a documented learning difference, significant family hardship, or an extraordinary talent that the institution specifically needs. Without one of these, this GPA creates a near-disqualifying headwind for elite schools.`);
  } else if (gpa < 3.7 && targetingElite) {
    liabilities.push(`Your GPA of ${gpa.toFixed(2)} is a moderate liability for your elite school targets. It will not automatically disqualify you, but it means your reader needs to see compensating evidence elsewhere in your file -- a dramatically upward trend, extraordinary test scores, or extracurricular achievement at a regional/national level. Without these, the GPA becomes the convenient reason to pass on an otherwise decent but undifferentiated file.`);
  } else if (gpa < 3.5) {
    liabilities.push(`Your GPA of ${gpa.toFixed(2)} limits your competitiveness at selective schools and needs to be addressed in your application narrative. An upward trend in recent semesters can partially offset this, but the number itself will be a factor.`);
  }

  if (testType === 'none' && targetingElite) {
    liabilities.push('Going test-optional at elite schools is a calculated risk. While these schools officially treat test-optional applicants equally, internal data consistently shows that submitted high scores correlate with higher admit rates. Without a score, admissions officers have one less data point to advocate for you in committee. If you can score above the school\'s 25th percentile, submitting is almost always the better strategy.');
  } else if (testType === 'sat' && testScore < 1350 && targetingElite) {
    liabilities.push(`A ${testScore} SAT is below the 25th percentile for your reach schools. At this level, you should seriously consider going test-optional rather than submitting a score that actively weakens your application. A score below a school's range signals to readers that you may struggle with their academic pace, fairly or not. Either invest in intensive prep to cross the 1450 threshold, or suppress the score entirely.`);
  } else if (testType === 'act' && testScore < 30 && targetingElite) {
    liabilities.push(`A ${testScore} ACT falls below the competitive range for your target schools. Consider whether going test-optional might serve you better than submitting this score. If you retake, focus your preparation narrowly on your two weakest sections -- targeted improvement there yields the biggest composite jump.`);
  }

  if (!activities.hasLeadership && !activities.hasResearch && !activities.hasAwards) {
    liabilities.push('The extracurricular profile presents the most significant risk in this application. Without leadership positions, research experience, or competitive recognitions, there is no clear evidence of the kind of initiative and achievement that selective schools use to differentiate applicants. This is not about padding a resume -- it is about demonstrating that you pursue things with depth and purpose. In its current form, this section of your application will read as passive.');
  } else if (!activities.hasLeadership && targetingElite) {
    liabilities.push('The absence of formal leadership roles is a notable gap for elite school applications. Admissions committees at these institutions expect to see that you have moved beyond participation to ownership. This does not necessarily require a title -- but it requires evidence that you drove outcomes, made decisions, and were accountable for results in at least one domain.');
  }

  if (activities.depth <= 2) {
    liabilities.push(`Only ${activities.depth} activit${activities.depth === 1 ? 'y was' : 'ies were'} identified in your profile. Competitive applications typically present 4-6 meaningful commitments. The issue is not the number per se, but that a short list raises the question: "What was this student doing with their time?" Admissions officers will wonder whether you lack initiative or simply did not report your activities fully. Either way, this section of your application needs immediate attention.`);
  }

  if (gradeLevel === '12th Grade' && gpa < 3.8 && targetingElite) {
    liabilities.push('As a senior, you have very limited runway to change your academic trajectory. Your transcript is essentially fixed. This means every other component of your application -- essays, recommendations, activity descriptions, and supplementals -- must be executed at the highest possible level. There is no margin for a mediocre personal statement or generic supplemental essays.');
  }

  if (liabilities.length === 0) {
    liabilities.push('No critical liabilities were identified in your profile. This is a strong position -- your focus should be on execution quality across every application component. The risk for profiles without obvious weaknesses is complacency: assuming the numbers will carry the day. They will not. At competitive schools, most rejected applicants had no obvious liabilities either.');
  }

  return liabilities.slice(0, 4);
}

function buildRankedImprovements(
  gpa: number,
  gradeLevel: string,
  testScore: number,
  testType: 'sat' | 'act' | 'none',
  activities: ReturnType<typeof evaluateActivities>,
  schools: { elite: string[]; competitive: string[] },
  strengthScore: number,
): string[] {
  const items: { priority: number; text: string }[] = [];
  const targetingElite = schools.elite.length > 0;
  const isSenior = gradeLevel === '12th Grade';

  if (!activities.hasLeadership && !activities.hasResearch && !activities.hasAwards) {
    items.push({
      priority: 1,
      text: 'HIGHEST PRIORITY: Your extracurricular profile needs immediate and significant development. Identify 1-2 areas where you have genuine interest and pursue depth aggressively: take on a leadership role, start a project, enter a competition, or begin an independent research effort. The goal is not to accumulate activities but to demonstrate that you can own something and create impact. This is the single change that would most improve your competitiveness.',
    });
  }

  if (!isSenior && gpa < 3.9) {
    items.push({
      priority: gpa < 3.5 ? 2 : 4,
      text: `Academic trajectory improvement: Your current ${gpa.toFixed(2)} GPA has room to strengthen. Enroll in the most rigorous courses available next semester (AP, IB, dual enrollment) and prioritize academic performance above all else. An upward trend in transcript difficulty and grades is one of the strongest signals admissions committees look for -- it demonstrates growth capacity and intellectual ambition. Even a single semester of markedly improved performance can shift the narrative.`,
    });
  }

  if (testType === 'none') {
    items.push({
      priority: 3,
      text: 'Testing strategy decision: Take a full-length, timed diagnostic for both the SAT and ACT within the next two weeks. Compare your baseline scores. If either exceeds the 25th percentile of your target schools, commit to 6-8 weeks of focused preparation on that test. If neither is close, plan to apply test-optional and redirect that preparation time to essay development. This decision should be made with data, not assumption.',
    });
  } else if ((testType === 'sat' && testScore < 1500 && targetingElite) || (testType === 'act' && testScore < 33 && targetingElite)) {
    items.push({
      priority: 3,
      text: `Test score improvement: Your current ${testType === 'sat' ? testScore + ' SAT' : testScore + ' ACT'} is below the median for your reach schools. Commission a score analysis to identify your weakest section, then invest in 6-8 weeks of targeted preparation on that section specifically. Cross-section improvement (e.g., raising math from 690 to 760) is more achievable than uniform improvement across all sections. Target the school's 50th percentile as your minimum goal.`,
    });
  }

  items.push({
    priority: isSenior ? 1 : 5,
    text: `Essay development: ${isSenior ? 'This is your most powerful remaining lever.' : 'Begin this process now, even if applications are months away.'} Write 3 complete drafts of your personal statement, each exploring a fundamentally different topic or angle. Do not refine a single idea -- generate multiple competing ideas first. The most common mistake is committing to the first "good enough" topic and polishing it into blandness. Your essay needs to reveal something that cannot be found anywhere else in your application -- a way of thinking, a formative moment, an obsession that defines you. Seek feedback from someone who knows you well, not just someone who writes well.`,
  });

  if (targetingElite) {
    items.push({
      priority: 6,
      text: `Supplemental essay strategy: Elite schools use supplementals to assess genuine fit. Research each school's specific programs, traditions, and values that align with your interests. The "Why This School" essay should never be interchangeable between schools -- readers can tell immediately. Reference specific professors, courses, research groups, or campus initiatives by name. Demonstrate that you have done the work to understand what makes each school unique and how you would contribute to that community specifically.`,
    });
  }

  if (!activities.hasResearch && targetingElite) {
    items.push({
      priority: isSenior ? 7 : 2,
      text: `Intellectual depth project: ${isSenior ? 'If time allows before applications, consider' : 'Pursue'} an independent research project, academic blog, or competition entry that demonstrates intellectual engagement beyond what is required. Email 3-5 professors at local universities in your area of interest -- a surprising number will respond to a motivated high school student. Even a brief mentorship or research assistantship signals the kind of self-directed curiosity that elite schools prize.`,
    });
  }

  items.push({
    priority: 8,
    text: 'Recommendation strategy: Identify 2 teachers who can speak to specific moments of intellectual growth, not just academic performance. The strongest recommendations describe a student\'s thought process, their response to challenge, and their impact on classroom discussion -- not their grade. Have a conversation with each recommender about specific moments you would like them to address. Provide them with a brief document outlining your goals and 2-3 anecdotes they might reference. Teachers who know your story write stronger letters.',
  });

  return items
    .sort((a, b) => a.priority - b.priority)
    .map((item) => item.text)
    .slice(0, 6);
}

function buildEssayAngles(
  activities: ReturnType<typeof evaluateActivities>,
  gpa: number,
  strengthScore: number,
): EssayAngle[] {
  const angles: EssayAngle[] = [];

  if (activities.hasResearch && activities.hasLeadership) {
    angles.push({
      title: 'The Collision of Inquiry and Action',
      description: 'Write about a specific moment when something you discovered through research or study compelled you to act -- to build something, organize people, or change how a community operates. The strongest version of this essay shows the internal tension between wanting to understand more and needing to do something now. Admissions readers see thousands of "I\'m a leader" and "I love learning" essays; what they rarely see is someone who shows how those two impulses collide and what happens when they do.',
    });
    angles.push({
      title: 'The Question That Changed Direction',
      description: 'Focus on one question -- encountered through your research, a conversation, or an unexpected observation -- that fundamentally redirected your thinking or commitments. Do not write about finding an answer. Write about how sitting with a question reshaped what you prioritize, how you spend your time, or how you see a problem everyone else considers settled.',
    });
  } else if (activities.hasResearch) {
    angles.push({
      title: 'The Unexpected Result',
      description: 'Describe a moment in your research or intellectual work where you encountered something that genuinely surprised you -- a result that contradicted your hypothesis, a gap in the literature that no one else seemed to notice, or a failure that turned out to be more interesting than success would have been. The goal is to show how you think when your assumptions break down.',
    });
    angles.push({
      title: 'The Translation Problem',
      description: 'Write about the challenge of explaining something complex to someone who does not share your context -- translating your research for a younger student, explaining a technical concept to a family member, or bridging two fields that do not usually communicate. This angle reveals communication skill, intellectual humility, and the depth of your understanding.',
    });
  } else if (activities.hasLeadership) {
    angles.push({
      title: 'The Decision I Was Not Ready For',
      description: 'Write about a specific leadership moment where you had to make a call you felt unqualified to make -- a conflict between team members, a strategic choice with no clear right answer, or a situation where your authority was questioned. Do not write about triumph. Write about the process of navigating uncertainty while others looked to you for direction. Vulnerability here is your greatest asset.',
    });
    angles.push({
      title: 'What I Would Do Differently',
      description: 'Choose a leadership experience and honestly explore what you got wrong. Not a "failure that was actually a success" narrative -- a genuine misjudgment, blind spot, or missed opportunity. Then show what you learned from the retrospective and how it changed your approach. Self-critical leaders are rare at any age, and admissions readers value this quality enormously.',
    });
  } else if (activities.hasCommunity) {
    angles.push({
      title: 'The Person I Cannot Forget',
      description: 'Write about one individual you encountered through your service work who changed how you see the world. Not an abstract lesson about privilege or gratitude -- a specific person, a specific conversation, a specific moment that disrupted your prior understanding. The strongest service essays are not about the writer\'s generosity; they are about the complexity of the world the writer encountered.',
    });
    angles.push({
      title: 'The System Behind the Symptom',
      description: 'Focus on a moment when your community work revealed a structural problem that individual effort cannot solve. Write about the frustration, the intellectual challenge, and what it made you want to study or change. This angle positions you as someone who thinks systemically -- a quality admissions officers associate with future impact.',
    });
  } else if (activities.hasArts) {
    angles.push({
      title: 'The Moment Before Performance',
      description: 'Write about the internal experience of creating or performing -- the doubt, the preparation, the vulnerability of presenting something you made to others. Artistic essays that succeed avoid describing the art itself and instead describe the artist\'s inner world during the process of creation or performance.',
    });
    angles.push({
      title: 'Art as a Way of Seeing',
      description: 'Describe how your artistic practice has given you a different way of perceiving the world -- patterns you notice, connections you make, ways you process experiences that differ from your peers. This angle works especially well if your intended major is not in the arts, because it reveals unexpected depth.',
    });
  } else {
    angles.push({
      title: 'The Quiet Obsession',
      description: 'Write about something you think about constantly that does not appear on your resume -- a subject you read about for pleasure, a problem you return to in idle moments, a fascination that feels too niche or personal to share in formal contexts. The best version of this essay makes the reader understand why this topic captivates you, and in doing so, reveals something essential about how your mind works.',
    });
    angles.push({
      title: 'The Conversation That Stays',
      description: 'Choose a single conversation -- with a family member, stranger, teacher, or friend -- that you continue to think about long after it ended. Reconstruct it with specificity: who said what, where you were, what shifted in your understanding. Essays grounded in a single vivid scene are more memorable than essays that summarize months of activity.',
    });
  }

  if (gpa < 3.7 || strengthScore < 55) {
    angles.push({
      title: 'The Turning Point',
      description: 'If your academic record does not tell your full story -- if there were circumstances, pivots, or periods of growth that the transcript alone cannot convey -- this is the essay that provides that context. Write about a specific moment of change: what happened, what you did, and what the trajectory has looked like since. Do not make excuses; instead, demonstrate self-awareness and forward momentum. Admissions committees respond to evidence of growth more than to perfection.',
    });
  }

  return angles.slice(0, 3);
}

function buildActionPlan(
  gpa: number,
  gradeLevel: string,
  testScore: number,
  testType: 'sat' | 'act' | 'none',
  activities: ReturnType<typeof evaluateActivities>,
  schools: { elite: string[]; competitive: string[]; other: string[] },
): ActionItem[] {
  const isSenior = gradeLevel === '12th Grade';
  const targetingElite = schools.elite.length > 0;

  const days0to30: string[] = [];
  const days30to60: string[] = [];
  const days60to90: string[] = [];

  if (testType === 'none') {
    days0to30.push('Take a full-length timed diagnostic SAT and ACT. Compare scores and decide which test to pursue (or whether to go test-optional). This decision should be made within 10 days.');
  } else if ((testType === 'sat' && testScore < 1500) || (testType === 'act' && testScore < 33)) {
    if (!isSenior) {
      days0to30.push(`Register for the next available ${testType.toUpperCase()} test date. Begin a focused prep plan targeting your weakest section -- commit to 1 hour per day, 5 days per week.`);
    } else {
      days0to30.push(`Evaluate whether retesting is viable given application deadlines. If the next test date allows score delivery before your earliest deadline, register immediately and begin intensive prep. Otherwise, decide whether to submit your current ${testScore} or go test-optional.`);
    }
  }

  days0to30.push('Write your first personal statement draft. Do not aim for polish -- aim for authentic exploration of a topic that matters to you. Set a deadline of 7 days from today.');

  if (!activities.hasLeadership && !isSenior) {
    days0to30.push('Identify 2-3 organizations or initiatives where you could pursue a leadership role. Reach out to advisors or current leaders to express your interest and lay groundwork.');
  }

  days0to30.push('Schedule conversations with 2 potential recommenders. Come prepared with a brief summary of your goals and 2-3 specific moments from their class you would like them to highlight.');

  if (targetingElite) {
    days30to60.push('Complete a second and third personal statement draft, each exploring a completely different topic. Share all three with a trusted reader and decide which direction is most revealing and distinctive.');
    days30to60.push(`Begin research on supplemental essay prompts for your top ${Math.min(schools.elite.length + schools.competitive.length, 5)} schools. Create a document mapping each school's specific programs, professors, and opportunities to your interests.`);
  } else {
    days30to60.push('Complete a second personal statement draft exploring a different angle. Compare both drafts and commit to the stronger direction. Begin refining.');
    days30to60.push('Research supplemental essay prompts for your target schools. Draft responses that demonstrate specific knowledge of each institution.');
  }

  if ((testType === 'sat' && testScore < 1500) || (testType === 'act' && testScore < 33) || testType === 'none') {
    days30to60.push('Take a full-length practice test to assess improvement. Adjust preparation strategy based on results. If progress has stalled, consider switching test formats or hiring a tutor for your weakest section.');
  }

  if (!activities.hasResearch && targetingElite && !isSenior) {
    days30to60.push('Email 3-5 professors at local universities in your area of interest, requesting mentorship or research assistant opportunities. Alternatively, begin an independent research project with a defined question and timeline.');
  }

  days60to90.push('Finalize your personal statement. It should have been through at least 4-5 substantive revisions with feedback from multiple readers. The final version should feel unmistakably yours -- not generic, not overpolished, not trying to impress.');

  if (targetingElite) {
    days60to90.push('Complete all supplemental essays in draft form. Each should reference specific, named elements of the school (a professor, a program, a tradition, a course). If you cannot name specific elements, you have not researched the school deeply enough.');
  }

  days60to90.push('Finalize your activity list descriptions. Each entry should lead with impact and specificity: what you did, how many people were affected, what changed as a result. Quantify wherever possible.');

  days60to90.push('Confirm that both recommenders have submitted or have a clear deadline. Follow up politely if needed. Provide any additional context they requested.');

  if (!isSenior && gpa < 3.9) {
    days60to90.push('Review your academic performance this semester. Ensure you are on track for the strongest possible grades, particularly in AP/IB courses. A strong current-semester transcript report can accompany your application.');
  }

  return [
    { timeframe: 'Days 1-30', items: days0to30 },
    { timeframe: 'Days 31-60', items: days30to60 },
    { timeframe: 'Days 61-90', items: days60to90 },
  ];
}

function buildFinalAdvisory(
  gpa: number,
  testScore: number,
  testType: 'sat' | 'act' | 'none',
  activities: ReturnType<typeof evaluateActivities>,
  schools: { elite: string[]; competitive: string[]; other: string[] },
  strengthScore: number,
  gradeLevel: string,
): string {
  const targetingElite = schools.elite.length > 0;
  const allSchools = [...schools.elite, ...schools.competitive, ...schools.other];
  const isSenior = gradeLevel === '12th Grade';

  let advisory = '';

  if (strengthScore >= 75 && targetingElite) {
    advisory = `This is a strong profile with the academic foundation to compete at the highest level. The critical risk is not weakness -- it is ordinariness. At ${schools.elite[0]} and similar institutions, your reader will review your file alongside dozens of applicants with comparable or better numbers. What separates admitted students from equally qualified rejected students is almost always the same thing: a distinctive voice, a clear intellectual identity, and an application that reads as if it could not have been written by anyone else. `;
    advisory += 'Your strategic priority is not to add more accomplishments but to present the ones you have with clarity, specificity, and genuine self-awareness. Every sentence in your application should either reveal something about how you think or demonstrate impact you have created. Eliminate anything generic, anything that could apply to a thousand other applicants. ';
    advisory += 'Build a balanced school list and take each application seriously, including your safety schools. The students who succeed in this process are the ones who approach each school as a genuine possibility, not just a ranked backup.';
  } else if (strengthScore >= 55 && targetingElite) {
    advisory = 'This profile has genuine potential but also clear gaps that must be addressed strategically. The academic numbers alone will not carry the application at your reach schools -- meaning every other component must be executed at an exceptionally high level. ';
    advisory += `The most important near-term investment is ${!activities.hasLeadership && !activities.hasAwards ? 'developing your extracurricular profile to include evidence of leadership and achievement' : testType === 'none' || (testType === 'sat' && testScore < 1400) || (testType === 'act' && testScore < 31) ? 'resolving your testing strategy -- either commit to serious preparation and a retake, or make a deliberate decision to go test-optional' : 'your personal statement -- it needs to be the single strongest piece of writing you have ever produced'}. `;
    advisory += `Be realistic about your school list. ${schools.elite.length > 2 ? 'Having more than 2-3 reach schools increases application workload without proportionally increasing your chances. Consider narrowing to the 1-2 schools where your profile and values are the strongest fit.' : 'Your reach schools are legitimate targets, but build a robust set of target and safety schools where you can genuinely envision yourself thriving.'} `;
    advisory += isSenior
      ? 'As a senior, your time is limited. Focus relentlessly on what you can still control: essay quality, recommendation strategy, and the precision of your supplemental essays.'
      : 'You still have time to meaningfully strengthen this profile. Use it wisely -- not to add volume, but to add depth and evidence of impact in your strongest areas.';
  } else if (strengthScore >= 55) {
    advisory = 'This is a competitive profile for your target school tier. Your strategic focus should be on application execution rather than profile building -- the fundamentals are in place, and the difference between an acceptance and a waitlist at your target schools will come down to how well you tell your story. ';
    advisory += 'Invest heavily in your personal statement and supplemental essays. At the schools you are targeting, these are the primary differentiators among applicants with similar academic profiles. Write with specificity and authenticity. ';
    advisory += 'Ensure your school list includes 2-3 genuine safety options where your stats clearly exceed the median. Having strong safety schools removes anxiety and allows you to take genuine shots at your target and reach schools without desperation coloring your application.';
  } else {
    advisory = 'This profile needs significant strategic development before it will be competitive at selective institutions. That is not a judgment -- it is an honest assessment that should shape how you spend the next several months. ';
    advisory += `The highest-leverage actions are: ${gpa < 3.5 && !isSenior ? 'improving your academic performance in the most rigorous courses available, ' : ''}${!activities.hasLeadership && !activities.hasResearch ? 'building substantive extracurricular depth with evidence of leadership or intellectual initiative, ' : ''}and crafting a personal statement that reveals something about you that numbers cannot capture. `;
    advisory += allSchools.length > 0
      ? `Reconsider your school list carefully. ${schools.elite.length > 0 ? `Schools like ${schools.elite[0]} are extreme reaches at your current profile strength. ` : ''}Focus the majority of your application energy on schools where you are a realistic contender -- institutions where your GPA and activities place you within the middle or upper portion of the admitted student profile.`
      : 'Building a strategic school list is your first step. Work with a counselor to identify schools where your profile is competitive, then add 1-2 aspirational options where you might surprise.';
    advisory += ' The admissions process rewards students who know themselves honestly and present that honest self with confidence. That starts with understanding where you stand -- which you are doing now.';
  }

  return advisory.trim();
}

export function analyzeProfile(profile: StudentProfile): AnalysisResult {
  const gpa = parseGpa(profile.gpa);
  const { score: testScore, type: testType } = parseSat(profile.satScore);
  const normalizedTest = normalizeTestScore(testScore, testType);
  const schools = categorizeSchools(profile.targetSchools);
  const activities = evaluateActivities(profile.activities);

  const gpaScore = Math.min((gpa / 4.0) * 100, 100);
  const raw = Math.round(
    gpaScore * 0.3 + normalizedTest * 0.25 + activities.score * 0.35 + (schools.other.length > 0 ? 10 : 0),
  );
  const strengthScore = Math.min(Math.max(raw, 12), 96);

  return {
    strengthScore,
    positioning: buildPositioning(schools, strengthScore),
    weaknesses: buildWeaknesses(gpa, testScore, testType, activities, schools),
    improvements: buildImprovements(gpa, profile.gradeLevel, testScore, testType, activities, schools),
    essayAngle: buildEssayAngle(activities),
    schoolTiers: buildSchoolTiers(schools, strengthScore, gpa, testScore, testType, activities),
    profileSummary: buildProfileSummary(gpa, testScore, testType, activities, strengthScore),
    executiveRead: buildExecutiveRead(gpa, testScore, testType, activities, schools, strengthScore, profile.gradeLevel),
    coreStrengths: buildCoreStrengths(gpa, testScore, testType, activities, strengthScore),
    criticalLiabilities: buildCriticalLiabilities(gpa, testScore, testType, activities, schools, profile.gradeLevel),
    rankedImprovements: buildRankedImprovements(gpa, profile.gradeLevel, testScore, testType, activities, schools, strengthScore),
    essayAngles: buildEssayAngles(activities, gpa, strengthScore),
    actionPlan: buildActionPlan(gpa, profile.gradeLevel, testScore, testType, activities, schools),
    finalAdvisory: buildFinalAdvisory(gpa, testScore, testType, activities, schools, strengthScore, profile.gradeLevel),
  };
}
