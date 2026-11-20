let studentsList = [];

let nextId = 1;

const studentForm = document.getElementById("studentForm");

const studentName = document.getElementById("studentName");

const grade1 = document.getElementById("grade1");
const grade2 = document.getElementById("grade2");
const grade3 = document.getElementById("grade3");

const attendance = document.getElementById("attendance");

const errorBox = document.getElementById("errorBox");

const studentsDisplay = document.getElementById("studentsDisplay");

const mercyBtn = document.getElementById("mercyBtn");

const reportDisplay = document.getElementById("reportDisplay");

class Student {

    #grades;
    #attendance;

    constructor(id, name, grades, attendance) {

        this.id = id;
        this.name = name;

        this.grades = grades;
        this.attendance = attendance;

    }


    // Grades Setter
    set grades(value) {

        if (!Array.isArray(value) || value.length !== 3) {
            throw new Error("يجب إدخال درجات المواد الثلاث.");
        }

        const checkedGrades = value.map(grade => {

            if (grade === "") {
                throw new Error("يجب إدخال جميع الدرجات.");
            }

            const number = Number(grade);

            if (!Number.isFinite(number) || number < 0 || number > 100) {
                throw new Error("الدرجات يجب أن تكون بين 0 و100.");
            }

            return number;

        });

        this.#grades = checkedGrades;

    }


    // Grades Getter
    get grades() {

        return [...this.#grades];

    }


    // Attendance Setter
    set attendance(value) {

        if (value === "") {
            throw new Error("يجب إدخال نسبة الحضور.");
        }

        const number = Number(value);

        if (!Number.isFinite(number) || number < 0 || number > 100) {
            throw new Error("نسبة الحضور يجب أن تكون بين 0 و100.");
        }

        this.#attendance = number;

    }


    // Attendance Getter
    get attendance() {

        return this.#attendance;

    }


    // Calculate Average
    calculateAverage() {

        const total = this.#grades.reduce((sum, grade) => {
            return sum + grade;
        }, 0);

        return total / this.#grades.length;

    }


    // Calculate Grade
    calculateGrade() {

        const average = this.calculateAverage();

        if (average >= 90) {
            return "A";
        }
        else if (average >= 80) {
            return "B";
        }
        else if (average >= 70) {
            return "C";
        }
        else if (average >= 60) {
            return "D";
        }
        else if (average >= 50) {
            return "E";
        }
        else {
            return "F";
        }

    }

    getResult() {

        if (this.calculateAverage() >= 50 && this.#attendance >= 75) {
            return "ناجح";
        }
        else {
            return "يحتاج مراجعة";
        }

    }

}

function renderStudents() {

    if (studentsList.length === 0) {

        studentsDisplay.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="bi bi-clipboard-heart"></i>
                </div>

                <p>لم تتم إضافة أي طالب حتى الآن.</p>
                <span>ابدئي بإضافة أول طالب ♡</span>
            </div>
        `;

        return;
    }


    studentsDisplay.innerHTML = studentsList.map(student => `

        <div class="student-item">

            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">

                <div class="student-name">
                    <i class="bi bi-person-circle me-1"></i>
                    ${escapeHTML(student.name)}
                </div>

                <span class="result-badge">
                    <i class="bi bi-award me-1"></i>
                    ${student.calculateGrade()}
                </span>

            </div>

            <div class="student-info">

                <div>
                    <i class="bi bi-hash"></i>
                    رقم الطالب: ${student.id}
                </div>

                <div>
                    <i class="bi bi-journal-check"></i>
                    الدرجات:
                    ${student.grades.join(" - ")}
                </div>

                <div>
                    <i class="bi bi-calendar-heart"></i>
                    نسبة الحضور:
                    ${student.attendance}%
                </div>

                <div>
                    <i class="bi bi-calculator"></i>
                    المتوسط:
                    ${student.calculateAverage().toFixed(2)}
                </div>

                <div>
                    <i class="bi bi-stars"></i>
                    التقدير:
                    ${student.calculateGrade()}
                </div>

            </div>

            <div class="mt-3">
                <span class="result-badge">
                    ${student.getResult()}
                </span>
            </div>

        </div>

    `).join("");

}


function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];

    });

}


function showError(message) {

    errorBox.textContent = message;

    errorBox.classList.remove("d-none");

}


function clearError() {

    errorBox.textContent = "";

    errorBox.classList.add("d-none");

}


studentForm.addEventListener("submit", function (event) {

    event.preventDefault();

    clearError();

    try {

        const name = studentName.value.trim();

        if (name === "") {
            throw new Error("من فضلك أدخل اسم الطالب.");
        }


        const grades = [
            grade1.value,
            grade2.value,
            grade3.value
        ];


        const newStudent = new Student(
            nextId,
            name,
            grades,
            attendance.value
        );


        studentsList.push(newStudent);

        nextId++;

        renderStudents();

        studentForm.reset();


        reportDisplay.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="bi bi-stars"></i>
                </div>

                <p>تمت إضافة الطالب بنجاح ♡</p>
                <span>فعّلي لجنة الرأفة لتحديث التقرير.</span>
            </div>
        `;

    }

    catch (error) {

        showError(error.message);

    }

});


mercyBtn.addEventListener("click", function () {

    clearError();


    // Filter Students
    const strugglingStudents = studentsList.filter(student => {

        const average = student.calculateAverage();

        return average >= 40 && average <= 49;

    });

    if (strugglingStudents.length === 0) {

        reportDisplay.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    <i class="bi bi-heart"></i>
                </div>

                <p>لا يوجد طلاب متعثرون يستحقون درجات الرأفة.</p>

                <span>كل النتائج تم مراجعتها ♡</span>

            </div>

            <div class="report-summary">

                <i class="bi bi-people me-1"></i>
                عدد الطلاب المتعثرين: 0

                <br>

                <i class="bi bi-calculator me-1"></i>
                المتوسط العام بعد الرأفة: لا يوجد

            </div>

        `;

        return;

    }


    // Map Students
    const studentsAfterMercy = strugglingStudents.map(student => {

        return {

            name: student.name,

            oldAverage: student.calculateAverage(),

            newAverage: student.calculateAverage() + 5

        };

    });


    // Reduce
    const totalAverage = studentsAfterMercy.reduce((sum, student) => {

        return sum + student.newAverage;

    }, 0);


    // General Average
    const generalAverage = studentsAfterMercy.length > 0
        ? totalAverage / studentsAfterMercy.length
        : 0;


    // Create Students Report
    const studentsReport = studentsAfterMercy.map(student => `

        <div class="report-item">

            <div class="student-name">
                <i class="bi bi-person-heart me-1"></i>
                ${escapeHTML(student.name)}
            </div>

            <div class="student-info">

                <i class="bi bi-graph-down me-1"></i>
                المتوسط قبل الرأفة:
                ${student.oldAverage.toFixed(2)}

                <br>

                <i class="bi bi-graph-up-arrow me-1"></i>
                المتوسط بعد الرأفة:
                ${student.newAverage.toFixed(2)}

            </div>

        </div>

    `).join("");


    // Display Report
    reportDisplay.innerHTML = `

        <div class="report-summary">

            <div>
                <i class="bi bi-people-fill me-1"></i>
                عدد الطلاب المتعثرين:

                <strong>
                    ${studentsAfterMercy.length}
                </strong>
            </div>

            <div class="mt-2">
                <i class="bi bi-stars me-1"></i>
                المتوسط العام بعد الرأفة:

                <strong>
                    ${generalAverage.toFixed(2)}
                </strong>
            </div>

        </div>

        <h5 class="mb-3" style="color: #70529f; font-weight: 800;">
            <i class="bi bi-card-list me-1"></i>
            أسماء الطلاب ونتائجهم
        </h5>

        ${studentsReport}

    `;

});


// =========================
// Initial Display
// =========================

renderStudents();