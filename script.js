document.getElementById('addEducation').addEventListener('click', addEducation);
document.getElementById('addExperience').addEventListener('click', addExperience);
document.getElementById('clearForm').addEventListener('click', clearForm);

document.getElementById('name').addEventListener('input', updateResumePreview);
document.getElementById('email').addEventListener('input', updateResumePreview);
document.getElementById('phone').addEventListener('input', updateResumePreview);
document.getElementById('summary').addEventListener('input', updateResumePreview);

function addEducation() {
    const educationRow = document.createElement('div');
    educationRow.innerHTML = `
        <input type="text" placeholder="Degree" required>
        <input type="text" placeholder="Institution" required>
        <input type="text" placeholder="Year" required>
        <button type="button" onclick="removeElement(this)">Remove</button>
    `;
    document.getElementById('educationRows').appendChild(educationRow);
    updateResumePreview();
}

function addExperience() {
    const experienceRow = document.createElement('div');
    experienceRow.innerHTML = `
        <input type="text" placeholder="Job Title" required>
        <input type="text" placeholder="Company" required>
        <input type="text" placeholder="Years" required>
        <button type="button" onclick="removeElement(this)">Remove</button>
    `;
    document.getElementById('experienceRows').appendChild(experienceRow);
    updateResumePreview();
}

function removeElement(button) {
    button.parentElement.remove();
    updateResumePreview();
}

function clearForm() {
    document.getElementById('resumeForm').reset();
    document.getElementById('educationRows').innerHTML = '';
    document.getElementById('experienceRows').innerHTML = '';
    document.getElementById('progressBar').style.width = '0%';
    updateResumePreview();
}

function updateResumePreview() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const summary = document.getElementById('summary').value;

    let skills = [];
    const skillCheckboxes = document.querySelectorAll('#skills input[type="checkbox"]:checked');
    skillCheckboxes.forEach(checkbox => skills.push(checkbox.value));

    const totalFields = 5 + document.getElementById('educationRows').children.length + document.getElementById('experienceRows').children.length + skillCheckboxes.length;
    const filledFields = [name, email, phone, summary, ...skills].filter(Boolean).length + document.getElementById('educationRows').children.length + document.getElementById('experienceRows').children.length;

    // Update progress bar
    const progressPercentage = (filledFields / totalFields) * 100;
    document.getElementById('progressBar').style.width = `${progressPercentage}%`;

    const resumeContent = `
        <h3>${name}</h3>
        <p>Email: ${email}</p>
        <p>Phone: ${phone}</p>
        <p>${summary}</p>
        <h4>Skills: ${skills.join(', ')}</h4>
        <h4>Education:</h4>
        <div id="educationPreview"></div>
        <h4>Experience:</h4>
        <div id="experiencePreview"></div>
    `;

    document.getElementById('resumeContent').innerHTML = resumeContent;

    // Update education and experience sections
    updateEducationPreview();
    updateExperiencePreview();
}

function updateEducationPreview() {
    const educationRows = document.getElementById('educationRows').children;
    const educationPreview = document.getElementById('educationPreview');
    educationPreview.innerHTML = '';
    for (let row of educationRows) {
        const inputs = row.getElementsByTagName('input');
        const degree = inputs[0]?.value || '';
        const institution = inputs[1]?.value || '';
        const year = inputs[2]?.value || '';
        if (degree && institution && year) {
            educationPreview.innerHTML += `<p>${degree}, ${institution} (${year})</p>`;
        }
    }
}

function updateExperiencePreview() {
    const experienceRows = document.getElementById('experienceRows').children;
    const experiencePreview = document.getElementById('experiencePreview');
    experiencePreview.innerHTML = '';
    for (let row of experienceRows) {
        const inputs = row.getElementsByTagName('input');
        const jobTitle = inputs[0]?.value || '';
        const company = inputs[1]?.value || '';
        const years = inputs[2]?.value || '';
        if (jobTitle && company && years) {
            experiencePreview.innerHTML += `<p>${jobTitle} at ${company} (${years})</p>`;
        }
    }
}

document.getElementById('downloadPDF').addEventListener('click', downloadPDF);

async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const summary = document.getElementById('summary').value;

    let skills = [];
    const skillCheckboxes = document.querySelectorAll('#skills input[type="checkbox"]:checked');
    skillCheckboxes.forEach(checkbox => skills.push(checkbox.value));

    // Prepare the content for the PDF
    let pdfContent = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nProfile Summary: ${summary}\n\nSkills: ${skills.join(', ')}\n\nEducation:\n`;
    
    const educationRows = document.getElementById('educationRows').children;
    for (let row of educationRows) {
        const inputs = row.getElementsByTagName('input');
        const degree = inputs[0]?.value || '';
        const institution = inputs[1]?.value || '';
        const year = inputs[2]?.value || '';
        if (degree && institution && year) {
            pdfContent += `${degree}, ${institution} (${year})\n`;
        }
    }

    pdfContent += '\nExperience:\n';
    const experienceRows = document.getElementById('experienceRows').children;
    for (let row of experienceRows) {
        const inputs = row.getElementsByTagName('input');
        const jobTitle = inputs[0]?.value || '';
        const company = inputs[1]?.value || '';
        const years = inputs[2]?.value || '';
        if (jobTitle && company && years) {
            pdfContent += `${jobTitle} at ${company} (${years})\n`;
        }
    }

    // Add the content to the PDF
    doc.text(pdfContent, 10, 10);
    doc.save('resume.pdf');
}
