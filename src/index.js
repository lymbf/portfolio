// const { default: gsap } = require('gsap/gsap-core');

gsap.registerPlugin(SplitText);

const init = () => {
	let currentId = 1;

	const btnNext = document.querySelector('svg.right');
	const btnPrev = document.querySelector('svg.left');

	gsap.set('.project', { x: '-100%' });

	//[][][][][][] TimeLines [][][][][]

	const getProject = index => {
		const project = document.querySelector('div.project' + index);
		const title = document.querySelector(
			'div.project' + index + ' .project-title'
		);
		const splitedTitle = new SplitText(title, { type: 'words, chars' })
			.chars;
		const description = document.querySelector(
			'div.project' + index + ' .project-description'
		);
		const viewBtn = document.querySelector(
			'div.project' + index + ' .btn-project'
		);
		return { project, title, description, viewBtn, splitedTitle };
	};

	const updateBody = id => {
		document.querySelector('body').className = 'project' + id;
	};

	const createTlOut = (index, direction) => {
		let x = direction === 'prev' ? '-350' : '350';
		const { project, title, description, viewBtn } = getProject(index);
		const tlOut = gsap.timeline();
		tlOut.to(project, {
			duration: 1,
			autoAlpha: 0,
			x: x,
			ease: 'back.in(2)'
		});
		return tlOut;
	};

	const createTlIn = (index, direction) => {
		let x = direction === 'prev' ? '100%' : '-100%';
		let x2 = direction === 'prev' ? 20 : -20;
		let rotation = direction === 'prev' ? '-60deg' : '60deg';
		let letters;
		const {
			project,
			title,
			description,
			viewBtn,
			splitedTitle
		} = getProject(index);
		letters =
			direction === 'next' ? splitedTitle : splitedTitle.reverse();
		const tlIn = gsap.timeline();
		tlIn
			.fromTo(
				project,
				{
					autoAlpha: 0,
					x: x
				},
				{
					duration: 0.7,
					autoAlpha: 1,
					x: 0,
					ease: 'power4.Out',
					onStart: updateBody,
					onStartParams: [index]
				}
			)
			.from(letters, {
				x: -20,
				y: 30,
				autoAlpha: 0,
				scale: 0.1,
				rotation: rotation,
				transformOrigin: '0 100% 0',
				stagger: 0.015,
				duration: 0.2,
				ease: 'power1.Out'
			})
			.from([description, viewBtn], {
				duration: 0.2,
				x: x2,
				autoAlpha: 0,
				stagger: 0.08
			});
		return tlIn;
	};

	const createTlTransition = (indexIn, indexOut, direction) => {
		const tlTransition = gsap.timeline();
		const tlIn = createTlIn(indexIn, direction);
		const tlOut = createTlOut(indexOut, direction);
		tlTransition.add(tlOut).add(tlIn);
		return tlTransition;
	};

	const isTweening = () => {
		return gsap.isTweening('.project');
	};

	//[][][][][][] Id manipulations [][][][][]

	const calcNextIds = id => {
		if (id < document.querySelectorAll('div.project').length) {
			currentId++;
			return [id + 1, id];
		} else {
			currentId = 1;
			return [1, id];
		}
	};

	const calcPrevIds = id => {
		if (id > 1) {
			currentId--;
			return [id - 1, id];
		} else {
			currentId = document.querySelectorAll('div.project').length;
			return [currentId, id];
		}
	};
	// [][][][][][][] Circle animation [][][][][]

	const animateCircles = e => {
		const circle = document.querySelector('.circle1');
		const circle2 = document.querySelector('.circle2');
		const circle3 = document.querySelector('.circle3');
		let { x, y } = e;
		const width = window.innerWidth;
		const height = window.innerHeight;

		x = (x - width / 2) / 50;
		y = (y - height / 10 * 4) / 50;

		gsap.to(circle, {
			duration: 1,
			ease: 'power3.In',
			x: x,
			y: y
		});
		gsap.to(circle2, {
			duration: 1,
			ease: 'power3',
			x: -x,
			y: -y
		});
		gsap.to(circle3, {
			duration: 1,
			ease: 'power3',
			x: x,
			y: -y
		});
	};

	// //[][][][][][] Initiating [][][][][]

	createTlIn(1);
	btnNext.addEventListener('click', () => {
		if (!isTweening()) {
			const [idIn, idOut] = calcNextIds(currentId);
			createTlTransition(idIn, idOut, 'next');
		}
	});
	btnPrev.addEventListener('click', () => {
		if (!isTweening()) {
			const [idIn, idOut] = calcPrevIds(currentId);
			createTlTransition(idIn, idOut, 'prev');
		}
	});

	const { project } = getProject(currentId);
	project.addEventListener('mousemove', e => {
		animateCircles(e);
	});
};

window.addEventListener('load', () => {
	init();
});
