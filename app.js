/**
 * KRATOS FIT - Front-end Application & Recovery Engine
 * Interactive DOMS Diagnosticator, Protocol Generator & UX Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Initialize Components
    initMobileMenu();
    initFaqAccordion();
    initDiagnosticWizard();
    initSmoothScroll();
});

/* ==========================================================
   1. MOBILE NAVIGATION
   ========================================================== */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    const navLinks = document.querySelectorAll('.mobile-nav-link');

    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            if (menuIcon) menuIcon.setAttribute('data-lucide', 'x');
        } else {
            mobileMenu.classList.add('hidden');
            if (menuIcon) menuIcon.setAttribute('data-lucide', 'menu');
        }
        if (window.lucide) lucide.createIcons();
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            if (menuIcon) menuIcon.setAttribute('data-lucide', 'menu');
            if (window.lucide) lucide.createIcons();
        });
    });
}

/* ==========================================================
   2. FAQ ACCORDION
   ========================================================== */
function initFaqAccordion() {
    const faqToggles = document.querySelectorAll('.faq-toggle');

    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const content = toggle.nextElementSibling;
            const icon = toggle.querySelector('[data-lucide="chevron-down"]');
            const isOpen = !content.classList.contains('hidden');

            // Close all items
            document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
            document.querySelectorAll('.faq-toggle [data-lucide="chevron-down"]').forEach(i => {
                i.style.transform = 'rotate(0deg)';
            });

            // Toggle current item
            if (!isOpen) {
                content.classList.remove('hidden');
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

/* ==========================================================
   3. KRATOS RECOVER - INTERACTIVE DIAGNOSTIC WIZARD
   ========================================================== */
function initDiagnosticWizard() {
    // State Store
    const state = {
        muscle: null,
        muscleName: '',
        painLevel: null,
        painName: '',
        timeElapsed: null,
        timeName: ''
    };

    // Step Elements
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const stepResult = document.getElementById('stepResult');

    // Indicator Elements
    const stepIndicatorLabel = document.getElementById('stepIndicatorLabel');
    const stepPercentage = document.getElementById('stepPercentage');
    const stepProgressBar = document.getElementById('stepProgressBar');

    // Controls
    const nextToStep2 = document.getElementById('nextToStep2');
    const prevToStep1 = document.getElementById('prevToStep1');
    const nextToStep3 = document.getElementById('nextToStep3');
    const prevToStep2 = document.getElementById('prevToStep2');
    const generateProtocolBtn = document.getElementById('generateProtocolBtn');
    const resetWizardBtn = document.getElementById('resetWizardBtn');
    const copyProtocolBtn = document.getElementById('copyProtocolBtn');

    // Selection Buttons
    const muscleBtns = document.querySelectorAll('.muscle-btn');
    const painBtns = document.querySelectorAll('.pain-btn');
    const timeBtns = document.querySelectorAll('.time-btn');

    // Step 1: Muscle Selection
    muscleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            muscleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.muscle = btn.getAttribute('data-muscle');
            state.muscleName = btn.querySelector('h4').textContent.trim();
            nextToStep2.removeAttribute('disabled');
        });
    });

    nextToStep2.addEventListener('click', () => {
        if (!state.muscle) return;
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
        stepIndicatorLabel.textContent = 'Passo 2 de 3: Nível de Intensidade';
        stepPercentage.textContent = '66%';
        stepProgressBar.style.width = '66%';
        scrollToWizard();
    });

    // Step 2: Pain Level Selection
    painBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            painBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.painLevel = parseInt(btn.getAttribute('data-pain'), 10);
            state.painName = btn.querySelector('h5').textContent.trim();
            nextToStep3.removeAttribute('disabled');
        });
    });

    prevToStep1.addEventListener('click', () => {
        step2.classList.add('hidden');
        step1.classList.remove('hidden');
        stepIndicatorLabel.textContent = 'Passo 1 de 3: Grupo Muscular';
        stepPercentage.textContent = '33%';
        stepProgressBar.style.width = '33%';
        scrollToWizard();
    });

    nextToStep3.addEventListener('click', () => {
        if (!state.painLevel) return;
        step2.classList.add('hidden');
        step3.classList.remove('hidden');
        stepIndicatorLabel.textContent = 'Passo 3 de 3: Tempo Decorrido';
        stepPercentage.textContent = '100%';
        stepProgressBar.style.width = '100%';
        scrollToWizard();
    });

    // Step 3: Time Elapsed Selection
    timeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            timeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.timeElapsed = parseInt(btn.getAttribute('data-time'), 10);
            state.timeName = btn.querySelector('h4').textContent.trim();
            generateProtocolBtn.removeAttribute('disabled');
        });
    });

    prevToStep2.addEventListener('click', () => {
        step3.classList.add('hidden');
        step2.classList.remove('hidden');
        stepIndicatorLabel.textContent = 'Passo 2 de 3: Nível de Intensidade';
        stepPercentage.textContent = '66%';
        stepProgressBar.style.width = '66%';
        scrollToWizard();
    });

    // Step 4: Generate Protocol
    generateProtocolBtn.addEventListener('click', () => {
        if (!state.timeElapsed) return;
        generateProtocol(state);
        step3.classList.add('hidden');
        stepResult.classList.remove('hidden');
        stepIndicatorLabel.textContent = 'Resultado: Protocolo Kratos Recover Pronto';
        stepPercentage.textContent = '100%';
        if (window.lucide) lucide.createIcons();
        scrollToWizard();
    });

    // Reset Wizard
    resetWizardBtn.addEventListener('click', () => {
        state.muscle = null;
        state.muscleName = '';
        state.painLevel = null;
        state.painName = '';
        state.timeElapsed = null;
        state.timeName = '';

        muscleBtns.forEach(b => b.classList.remove('active'));
        painBtns.forEach(b => b.classList.remove('active'));
        timeBtns.forEach(b => b.classList.remove('active'));

        nextToStep2.setAttribute('disabled', 'true');
        nextToStep3.setAttribute('disabled', 'true');
        generateProtocolBtn.setAttribute('disabled', 'true');

        stepResult.classList.add('hidden');
        step1.classList.remove('hidden');
        stepIndicatorLabel.textContent = 'Passo 1 de 3: Grupo Muscular';
        stepPercentage.textContent = '33%';
        stepProgressBar.style.width = '33%';
        scrollToWizard();
    });

    // Copy Protocol to Clipboard
    copyProtocolBtn.addEventListener('click', () => {
        copyProtocolText(state);
    });
}

function scrollToWizard() {
    const wizardCard = document.getElementById('wizardCard');
    if (wizardCard) {
        wizardCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/* ==========================================================
   4. SCIENTIFIC RECOVERY PROTOCOL ENGINE
   ========================================================== */
function generateProtocol(state) {
    const muscleTitle = document.getElementById('resultMuscleTitle');
    const parametersSummary = document.getElementById('resultParametersSummary');
    const safetyAlert = document.getElementById('resultSafetyAlert');
    const safetyAlertText = document.getElementById('resultSafetyAlertText');

    // Dynamic Protocol Card Targets
    const tempBadge = document.getElementById('tempBadge');
    const tempAdviceText = document.getElementById('tempAdviceText');
    const tempDuration = document.getElementById('tempDuration');

    const activeRecoveryText = document.getElementById('activeRecoveryText');
    const activeRecoveryGoal = document.getElementById('activeRecoveryGoal');

    const myofascialText = document.getElementById('myofascialText');
    const nutritionText = document.getElementById('nutritionText');

    // Title and Summary Updates
    muscleTitle.textContent = `Protocolo Personalizado: ${state.muscleName}`;
    parametersSummary.textContent = `Intensidade: Nível ${state.painLevel} (${state.painName}) • Tempo Pós-Treino: ${state.timeName}`;

    // Safety Alert Check (Pain 5 or Long Persistent Pain)
    if (state.painLevel === 5) {
        safetyAlert.classList.remove('hidden');
        safetyAlertText.innerHTML = `<strong>Nível 5 de dor reportado:</strong> Esta intensidade pode indicar estiramento, microrruptura de grau 2 ou processo inflamatório agudo nos tendões. Evite qualquer tipo de carga, não force alongamentos e consulte um médico ou fisioterapeuta caso haja hematoma ou inchaço visível.`;
    } else if (state.timeElapsed >= 72 && state.painLevel >= 4) {
        safetyAlert.classList.remove('hidden');
        safetyAlertText.innerHTML = `<strong>Atenção ao tempo prolongado:</strong> A dor tardia (DOMS) costuma declinar substancialmente após 72 horas. Dores intensas mantidas além desse período justificam uma reavaliação clínica para descartar lesão mecânica oculta.`;
    } else {
        safetyAlert.classList.add('hidden');
    }

    // 1. Temperature Advice Logic (Cold vs Heat based on timing)
    if (state.timeElapsed <= 12) {
        tempBadge.textContent = 'Crioterapia / Gelo Pontual';
        tempBadge.className = 'text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30';
        tempAdviceText.textContent = `Como o treino foi há menos de 12 horas, aplique bolsa de gelo protegida por um pano fino por 12 a 15 minutos na região de ${state.muscleName.toLowerCase()}. Isso controla a vasodilatação excessiva imediata e o extravasamento plasmático inicial.`;
        tempDuration.textContent = 'Duração: 12-15 minutos • 1 a 2 vezes nas primeiras horas';
    } else if (state.timeElapsed <= 24) {
        tempBadge.textContent = 'Banho de Contraste ou Crioterapia';
        tempBadge.className = 'text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30';
        tempAdviceText.textContent = `No limiar de 24 horas, o banho de contraste (alternar 2 minutos de água morna com 1 minuto de água fria por 3 ciclos) promove ginástica vascular, reduzindo a sensação de peso e fadiga neuromuscular em ${state.muscleName.toLowerCase()}.`;
        tempDuration.textContent = 'Duração: 10 minutos totais de contraste no chuveiro';
    } else {
        // 48h or 72h+ -> Heat / Vasodilation
        tempBadge.textContent = 'Termoterapia / Calor Vasodilatador';
        tempBadge.className = 'text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30';
        tempAdviceText.textContent = `Nesta fase (pico ou remissão), compressas quentes ou banho morno por 20 minutos são ideais. O calor estimula a circulação sanguínea profunda, relaxa os fusos neuromusculares e acelera a remoção de metabólitos acumulados.`;
        tempDuration.textContent = 'Duração: 15 a 20 minutos • 1 a 2 vezes ao dia';
    }

    // 2. Muscle-Specific Active Recovery Logic
    activeRecoveryText.textContent = getActiveRecoveryAdvice(state.muscle, state.painLevel);
    activeRecoveryGoal.textContent = `Frequência cardíaca em Zona 1 (50-60% da FC máx) • Estimula óxido nítrico endotelial`;

    // 3. Myofascial & Mobility Logic
    myofascialText.textContent = getMyofascialAdvice(state.muscle, state.painLevel);

    // 4. Nutrition & Sleep
    nutritionText.textContent = `Hidratação calculada: Ingerir de 35 a 40 ml de água por kg de peso corporal hoje, acrescido de uma pitada de sal marinho ou eletrólitos para retenção intracelular. Garanta 20-30g de proteína de digestão lenta antes de dormir e priorize 8 horas de sono contínuo para secreção de GH e IGF-1.`;
}

function getActiveRecoveryAdvice(muscle, painLevel) {
    if (painLevel >= 5) {
        return `Devido à dor extrema, repouse o membro afetado hoje. Faça apenas caminhada leve em piso plano por 10 minutos se for confortável, sem qualquer movimento explosivo ou com carga.`;
    }

    switch (muscle) {
        case 'pernas':
            return `Realize 20 minutos de pedalada leve em bicicleta ergométrica (carga 1 ou 2, cadência de 70-80 RPM) ou caminhada suave em terreno plano. O movimento rítmico ativa a bomba muscular da panturrilha e quadríceps sem estresse excêntrico.`;
        case 'costas':
            return `Pratique 15 minutos de mobilidade torácica suave no chão: movimentos de 'Gato-Vaca' (Cat-Cow) lentos, respirações diafragmáticas profundas com descompressão pendular suave (pendurar-se em barra por 10 segundos com pés apoiados no chão).`;
        case 'peito':
            return `Faça movimentos circulares amplos e lentos com os braços (sem peso), além de aberturas de tórax no batente da porta com intensidade 2/10. Realize caminhada leve de 20 min com oscilação livre dos braços para oxigenação sistêmica.`;
        case 'bracos':
            return `Rotações suaves de punhos e flexões de cotovelo sem carga no ar (2 séries de 15 movimentos muito lentos). Caminhadas com os braços balançando naturalmente ajudam a drenar o edema intersticial nos antebraços e bíceps.`;
        case 'panturrilhas':
            return `Subidas e descidas lentas na ponta dos pés em chão plano (sem peso extra, 2 séries de 10 repetições suaves) e 15 minutos de caminhada descalço em grama ou superfície macia para massagear a fáscia plantar.`;
        case 'abdomen':
            return `Evite pranchas ou abdominais. Pratique respirações diafragmáticas profundas deitado de costas, alternando com a postura da cobra do yoga suave (apoiado nos antebraços) por 20 segundos para descomprimir a parede abdominal.`;
        case 'gluteos':
            return `Pontes de quadril no chão sem carga (2 séries de 8 repetições leves apenas para reconectar o estímulo motor) associadas a caminhada em esteira com inclinação de 1% por 20 minutos.`;
        case 'geral':
        default:
            return `Caminhada contínua em ritmo de passeio por 25 a 30 minutos em local arejado, combinada com mobilidade articular geral de tornozelos, quadris e ombros.`;
    }
}

function getMyofascialAdvice(muscle, painLevel) {
    if (painLevel >= 5) {
        return `Com dor nível 5, suspenda a automassagem pesada e o foam roller rígido. Qualquer pressão mecânica agressiva agora pode exacerbar micro-rupturas nos fascículos musculares. Aplique apenas toques suaves ou drenagem linfática superficial.`;
    }

    const pressure = painLevel >= 3 ? 'pressão muito suave a moderada' : 'pressão moderada';

    switch (muscle) {
        case 'pernas':
            return `Utilize o rolo de espuma (foam roller) nas coxas (banda iliotibial, quadríceps e isquiotibiais) com ${pressure}. Role devagar por 60 segundos por grupo muscular, parando por 20 segundos em pontos tensos sem forçar o limiar da dor.`;
        case 'costas':
            return `Deite-se sobre duas bolinhas de tênis unidas (estilo 'peanut') ao longo dos paravertebrais torácicos com ${pressure}, evitando rolar diretamente sobre as vértebras lombares ou ossos da coluna.`;
        case 'peito':
            return `Com uma bolinha de tênis ou de massagem contra a parede, pressione levemente a região do peitoral menor próximo à axila em pequenos movimentos circulares por 45 segundos de cada lado.`;
        case 'bracos':
            return `Com a mão oposta, faça deslizamentos manuais firmes porém relaxantes do punho em direção ao ombro (sentido do retorno venoso), aliviando a fáscia do bíceps e tríceps.`;
        case 'panturrilhas':
            return `Sente-se no chão e apoie a panturrilha sobre o rolo de espuma. Mova a perna para frente e para trás lentamente com ${pressure}, fazendo rotações de tornozelo enquanto o músculo é comprimido.`;
        default:
            return `Realize deslizamentos miofasciais leves por 1 a 2 minutos no ventre muscular com óleo vegetal ou hidratante, sempre em direção ao coração para estimular o fluxo linfático.`;
    }
}

/* ==========================================================
   5. COPY TO CLIPBOARD & TOAST NOTIFICATION
   ========================================================== */
function copyProtocolText(state) {
    const textToCopy = `KRATOS FIT - PROTOCOLO DE RECUPERAÇÃO DOMS
--------------------------------------------------
Grupo Muscular: ${state.muscleName}
Intensidade da Dor: Nível ${state.painLevel} (${state.painName})
Tempo Pós-Treino: ${state.timeName}

1. TERAPIA TÉRMICA:
${document.getElementById('tempAdviceText').textContent.trim()}
${document.getElementById('tempDuration').textContent.trim()}

2. RECUPERAÇÃO ATIVA:
${document.getElementById('activeRecoveryText').textContent.trim()}

3. MOBILIDADE E LIBERAÇÃO MIOFASCIAL:
${document.getElementById('myofascialText').textContent.trim()}

4. BIOQUÍMICA E SONO:
${document.getElementById('nutritionText').textContent.trim()}

--------------------------------------------------
Gerado via Kratos Fit: Plataforma Científica de Recuperação.`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('Protocolo copiado para a área de transferência!');
        }).catch(() => {
            fallbackCopy(textToCopy);
        });
    } else {
        fallbackCopy(textToCopy);
    }
}

function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showToast('Protocolo copiado com sucesso!');
    } catch (err) {
        showToast('Não foi possível copiar automaticamente.');
    }
    document.body.removeChild(textArea);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
    }, 3200);
}

/* ==========================================================
   6. SMOOTH SCROLLING & HEADER SHADOW ON SCROLL
   ========================================================== */
function initSmoothScroll() {
    const header = document.getElementById('mainHeader');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('shadow-lg', 'bg-kratos-dark/95', 'border-kratos-border/80');
        } else {
            header.classList.remove('shadow-lg', 'bg-kratos-dark/95', 'border-kratos-border/80');
        }
    }, { passive: true });
}
