import { useState, useEffect, useRef } from 'react';
import './index.css';

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [notification, setNotification] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const [visitedHeroes, setVisitedHeroes] = useState<Set<number>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Генерируем звёзды один раз при монтировании компонента
  const stars = useRef<Array<{ id: number; left: string; delay: string; duration: string }>>([]);
  if (stars.current.length === 0) {
    stars.current = [...Array(100)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 2}s`
    }));
  }

  // Загружаем просмотренных героев из localStorage
  useEffect(() => {
    const visited = JSON.parse(localStorage.getItem('visitedHeroes') || '[]');
    setVisitedHeroes(new Set(visited));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  

  const scrollToHeroes = () => {
    document.getElementById('heroes')?.scrollIntoView({ behavior: 'smooth' });
  };

  // При возврате на страницу — плавно скроллим к героям
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted || performance.navigation.type === 2) {
        setTimeout(() => {
          document.getElementById('heroes')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const showNotification = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 4000);
  };

  const handleHeroClick = async (e: React.MouseEvent<HTMLAnchorElement>, file: string, name: string, heroId: number) => {
    e.preventDefault();
    const url = `/heroes/${file}.html`;
    
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        // Сохраняем как просмотренное в localStorage
        const visited = JSON.parse(localStorage.getItem('visitedHeroes') || '[]');
        if (!visited.includes(heroId)) {
          visited.push(heroId);
          localStorage.setItem('visitedHeroes', JSON.stringify(visited));
        }
        setVisitedHeroes(new Set(visited));
        window.location.href = url;
      } else {
        showNotification(`Ошибка: страница "${name}" пока не добавлена или неисправна. Попробуйте чуть позже.`);
      }
    } catch (error) {
      showNotification(`Ошибка: страница "${name}" пока не добавлена или неисправна. Попробуйте чуть позже.`);
    }
  };

  const heroes = [
    { id: 1, name: 'Авакян Грант Арамович', file: 'avakyan-grant', variant: 1 },
    { id: 2, name: 'Евдокушин Иван Андреевич', file: 'evdokushin-ivan', variant: 2 },
    { id: 3, name: 'Ровчак Михаил Александрович', file: 'rovchak-mikhail', variant: 3 },
    { id: 4, name: 'Мизин Гавриил Ефимович', file: 'mizin-gavriil', variant: 4 },
    { id: 5, name: 'Макеев Василий Иванович', file: 'makeev-vasiliy', variant: 5 },
    { id: 6, name: 'Левадный Пётр Никифорович', file: 'levadny-petr', variant: 6 },
    { id: 7, name: 'Ушмодин Игнат Иванович', file: 'ushmodin-ignat', variant: 7 },
    { id: 8, name: 'Понарин Иван', file: 'ponarin-ivan', variant: 8 },
    { id: 9, name: 'Груманцев Михаил Фомич', file: 'grumantsev-mikhail', variant: 9 },
    { id: 10, name: 'Баринов Николай Васильевич', file: 'barinov-nikolay', variant: 10 },
    { id: 11, name: 'Серченков Арсентий Прокофьевич', file: 'serchenkov-arsentiy', variant: 1 },
    { id: 12, name: 'Петренко Пётр Ильич', file: 'petrenko-petr', variant: 2 },
    { id: 13, name: 'Баталин Борис Васильевич', file: 'batalin-boris', variant: 3 },
    { id: 14, name: 'Ермолаев Серафим Дмитриевич', file: 'ermolaev-serafim', variant: 4 },
    { id: 15, name: 'Бондарев Александр Ефимович', file: 'bondarev-aleksandr', variant: 5 },
    { id: 16, name: 'Кузнецова Раиса Григорьевна', file: 'kuznetsova-raisa', variant: 6 },
    { id: 17, name: 'Масютин Фёдор Петрович', file: 'masyutin-fedor', variant: 7 },
    { id: 18, name: 'Кряжевский Аркадий Андреевич', file: 'kryazhevskiy-arkadiy', variant: 8 },
    { id: 19, name: 'Сухомлинов Борис Григорьевич', file: 'suhomlinov-boris', variant: 9 },
    { id: 20, name: 'Нестеров Сергей Павлович', file: 'nesterov-sergey', variant: 10 },
    { id: 21, name: 'Белоусов Тимофей Прокофьевич', file: 'belousov-timofey', variant: 1 },
    { id: 22, name: 'Савин Семён Николаевич', file: 'savin-semen', variant: 2 },
    { id: 23, name: 'Кириленко Зинаида Филипповна', file: 'kirilenko-zinaida', variant: 3 },
    { id: 24, name: 'Андриасян Жорж Михайлович', file: 'andriasyan-zhorzh', variant: 4 },
    { id: 25, name: 'Дмитриенко Степан Абрамович', file: 'dmitrienko-stepan', variant: 5 },
    { id: 26, name: 'Демонов Григорий Степанович', file: 'demonov-grigoriy', variant: 6 },
    { id: 27, name: 'Бегларян Амбарцум Геннадиевич', file: 'beglaryan-ambartsum', variant: 7 },
    { id: 28, name: 'Варавин Пётр', file: 'varavin-petr', variant: 8 },
    { id: 29, name: 'Демехин Афанасий Григорьевич', file: 'demekhin-afanasiy', variant: 9 },
    { id: 30, name: 'Губанов Лука Иванович', file: 'gubanov-luka', variant: 10 },
    { id: 31, name: 'Ахметшин Амирьян Сафуанович', file: 'akhmetshin-amiryan', variant: 1 },
    { id: 32, name: 'Азаров Фёдор', file: 'azarov-fedor', variant: 2 },
  ];

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current) {
      e.preventDefault();
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="app">
      <div className="sky-background"></div>

      {/* Уведомление */}
      {notification.show && (
        <div className="notification">
          <span>{notification.message}</span>
          <button onClick={() => setNotification({ show: false, message: '' })}>✕</button>
        </div>
      )}

      <div className="clouds-container" style={{
        transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
      }}>
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
        <div className="cloud cloud-4"></div>
        <div className="cloud cloud-5"></div>
        <div className="cloud cloud-6"></div>
      </div>

      {/* Георгиевская лента */}
      <svg className="ribbon-svg" viewBox="0 0 2000 6500" preserveAspectRatio="none">
        <defs>
          <filter id="ribbon-shadow">
            <feDropShadow dx="3" dy="5" stdDeviation="4" floodOpacity="0.35" />
          </filter>
        </defs>
        
        {/* Чёрная полоска 1 */}
        <path className="ribbon-stripe" 
          d="M -50,100 
            C 1700,540 1845,675 1925,730
            C 2000,780 1950,880 1750,920 
            C 1550,960 1350,1000 1150,1040 
            C 950,1080 750,1120 550,1160 
            C 350,1200 200,1260 150,1340 
            C 100,1420 200,1520 350,1580 
            C 500,1640 650,1680 850,1720 
            C 1050,1760 1250,1800 1450,1860 
            C 1650,1920 1800,2000 1900,2100 
            C 1970,2180 1900,2300 1700,2380 
            C 1500,2460 1300,2520 1100,2580 
            C 900,2640 700,2700 500,2780 
            C 300,2860 200,2960 150,3080 
            C 100,3200 200,3340 350,3420 
            C 500,3500 650,3560 850,3620 
            C 1050,3680 1250,3740 1450,3820 
            C 1650,3900 1800,4000 1900,4120 
            C 1970,4200 1900,4320 1700,4400 
            C 1500,4480 1300,4540 1100,4600 
            C 900,4660 700,4720 500,4800 
            C 300,4880 200,4980 170,5100 
            C 140,5220 250,5340 400,5420 
            C 550,5500 750,5560 950,5620 
            C 1150,5680 1350,5740 1550,5820 
            C 1750,5900 1900,6000 2000,6120
            C 2100,6240 2200,6340 2300,6420" 
          fill="none" stroke="#1a1a1a" strokeWidth="16" />
        
        {/* Оранжевая полоска 1 */}
        <path className="ribbon-stripe" 
          d="M -50,115 
            C 1700,555 1845,690 1925,745
            C 2000,795 1950,895 1750,935 
            C 1550,975 1350,1015 1150,1055 
            C 950,1095 750,1135 550,1175 
            C 350,1215 200,1275 150,1355 
            C 100,1435 200,1535 350,1595 
            C 500,1655 650,1695 850,1735 
            C 1050,1775 1250,1815 1450,1875 
            C 1650,1935 1800,2015 1900,2115 
            C 1970,2195 1900,2315 1700,2395 
            C 1500,2475 1300,2535 1100,2595 
            C 900,2655 700,2715 500,2795 
            C 300,2875 200,2975 150,3095 
            C 100,3215 200,3355 350,3435 
            C 500,3515 650,3575 850,3635 
            C 1050,3695 1250,3755 1450,3835 
            C 1650,3915 1800,4015 1900,4135 
            C 1970,4215 1900,4335 1700,4415 
            C 1500,4495 1300,4555 1100,4615 
            C 900,4675 700,4735 500,4815 
            C 300,4895 200,4995 170,5115 
            C 140,5235 250,5355 400,5435 
            C 550,5515 750,5575 950,5635 
            C 1150,5695 1350,5755 1550,5835 
            C 1750,5915 1900,6015 2000,6135
            C 2100,6255 2200,6355 2300,6435" 
          fill="none" stroke="#d97706" strokeWidth="19" />
        
        {/* Чёрная полоска 2 */}
        <path className="ribbon-stripe" 
          d="M -50,133 
            C 1700,573 1845,708 1925,763
            C 2000,813 1950,913 1750,953 
            C 1550,993 1350,1033 1150,1073 
            C 950,1113 750,1153 550,1193 
            C 350,1233 200,1293 150,1373 
            C 100,1453 200,1553 350,1613 
            C 500,1673 650,1713 850,1753 
            C 1050,1793 1250,1833 1450,1893 
            C 1650,1953 1800,2033 1900,2133 
            C 1970,2213 1900,2333 1700,2413 
            C 1500,2493 1300,2553 1100,2613 
            C 900,2673 700,2733 500,2813 
            C 300,2893 200,2993 150,3113 
            C 100,3233 200,3373 350,3453 
            C 500,3533 650,3593 850,3653 
            C 1050,3713 1250,3773 1450,3853 
            C 1650,3933 1800,4033 1900,4153 
            C 1970,4233 1900,4353 1700,4433 
            C 1500,4513 1300,4573 1100,4633 
            C 900,4693 700,4753 500,4833 
            C 300,4913 200,5013 170,5133 
            C 140,5253 250,5373 400,5453 
            C 550,5533 750,5593 950,5653 
            C 1150,5713 1350,5773 1550,5853 
            C 1750,5933 1900,6033 2000,6153
            C 2100,6273 2200,6373 2300,6453" 
          fill="none" stroke="#1a1a1a" strokeWidth="16" />
        
        {/* Оранжевая полоска 2 */}
        <path className="ribbon-stripe" 
          d="M -50,149 
            C 1700,589 1845,724 1925,779
            C 2000,829 1950,929 1750,969 
            C 1550,1009 1350,1049 1150,1089 
            C 950,1129 750,1169 550,1209 
            C 350,1249 200,1309 150,1389 
            C 100,1469 200,1569 350,1629 
            C 500,1689 650,1729 850,1769 
            C 1050,1809 1250,1849 1450,1909 
            C 1650,1969 1800,2049 1900,2149 
            C 1970,2229 1900,2349 1700,2429 
            C 1500,2509 1300,2569 1100,2629 
            C 900,2689 700,2749 500,2829 
            C 300,2909 200,3009 150,3129 
            C 100,3249 200,3389 350,3469 
            C 500,3549 650,3609 850,3669 
            C 1050,3729 1250,3789 1450,3869 
            C 1650,3949 1800,4049 1900,4169 
            C 1970,4249 1900,4369 1700,4449 
            C 1500,4529 1300,4589 1100,4649 
            C 900,4709 700,4769 500,4849 
            C 300,4929 200,5029 170,5149 
            C 140,5269 250,5389 400,5469 
            C 550,5549 750,5609 950,5669 
            C 1150,5729 1350,5789 1550,5869 
            C 1750,5949 1900,6049 2000,6169
            C 2100,6289 2200,6389 2300,6469" 
          fill="none" stroke="#d97706" strokeWidth="19" />
        
        {/* Чёрная полоска 3 */}
        <path className="ribbon-stripe" 
          d="M -50,167 
            C 1700,607 1845,742 1925,797
            C 2000,847 1950,947 1750,987 
            C 1550,1027 1350,1067 1150,1107 
            C 950,1147 750,1187 550,1227 
            C 350,1267 200,1327 150,1407 
            C 100,1487 200,1587 350,1647 
            C 500,1707 650,1747 850,1787 
            C 1050,1827 1250,1867 1450,1927 
            C 1650,1987 1800,2067 1900,2167 
            C 1970,2247 1900,2367 1700,2447 
            C 1500,2527 1300,2587 1100,2647 
            C 900,2707 700,2767 500,2847 
            C 300,2927 200,3027 150,3147 
            C 100,3267 200,3407 350,3487 
            C 500,3567 650,3627 850,3687 
            C 1050,3747 1250,3807 1450,3887 
            C 1650,3967 1800,4067 1900,4187 
            C 1970,4267 1900,4387 1700,4467 
            C 1500,4547 1300,4607 1100,4667 
            C 900,4727 700,4787 500,4867 
            C 300,4947 200,5047 170,5167 
            C 140,5287 250,5407 400,5487 
            C 550,5567 750,5627 950,5687 
            C 1150,5747 1350,5807 1550,5887 
            C 1750,5967 1900,6067 2000,6187
            C 2100,6307 2200,6407 2300,6487" 
          fill="none" stroke="#1a1a1a" strokeWidth="16" />
      </svg>

      <main className="content">
        <section className="hero-section">
          <div className="hero-content" style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}>
            <h1 className="main-title">ВЕЧНАЯ СЛАВА ГЕРОЯМ</h1>
            
            <a 
              href="https://project-pamyat.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="class-cloud"
              style={{ textDecoration: 'none' }}
            >
              <span className="class-name">Другие наши проекты</span>
            </a>
            
            <button className="hero-button" onClick={scrollToHeroes}><span className="crane-icon">✉️</span><span>Вспомнить героев</span></button>
          </div>
        </section>

        <section className="about-section">
          <div className="cloud-text-container">
            <div className="cloud-text-bg"></div>
            <div className="about-content">
              <h2 className="section-title">О проекте</h2>
              <p className="about-text">Этот сайт создан учениками 10 классов в память о героях Великой Отечественной войны — наших прадедушках и прабабушках, которые защищали Родину и подарили нам мирное небо над головой.</p>
              <p className="about-text">Каждая история — это живая память о подвиге, мужестве и несгибаемой воле к победе. Мы собрали рассказы, фотографии и воспоминания, чтобы имена героев навсегда остались в наших сердцах.</p>
              <div className="quote">"Пока мы помним — они живы"</div>
            </div>
          </div>
        </section>

        <section className="memory-section">
          <div className="memory-content">
            <h2 className="section-title gold-title">Почему это важно?</h2>
            <div className="memory-cards">
              <div className="memory-card"><div className="memory-icon">🕊️</div><h3>Связь поколений</h3><p>Георгиевская лента — символ, связывающий прошлое и настоящее, объединяющий поколения</p></div>
              <div className="memory-card"><div className="memory-icon">📖</div><h3>Живая история</h3><p>Каждая история — это урок мужества, стойкости и любви к Родине для будущих поколений</p></div>
              <div className="memory-card"><div className="memory-icon">❤️</div><h3>Благодарность</h3><p>Мы в вечном долгу перед теми, кто отдал жизни за наше светлое будущее</p></div>
            </div>
          </div>
        </section>

        <section className="heroes-section" id="heroes">
          <div className="heroes-header-block">
            <h2 className="section-title heroes-main-title">Наше небо Памяти</h2>
            <p className="heroes-subheader">Их имена — в наших сердцах</p>
          </div>

          <div className="heroes-scroll-container" ref={scrollContainerRef} onWheel={handleWheel}>
            <div className="heroes-grid">
              {heroes.map((hero, index) => (
                <div key={hero.id} className={`hero-card variant-${hero.variant}${visitedHeroes.has(hero.id) ? ' hero-card-visited' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="hero-card-inner">
                    <div className="hero-photo-icon"></div>
                    <h3 className="hero-name">{hero.name}</h3>
                    <a 
                      href={`/heroes/${hero.file}.html`} 
                      className="hero-link"
                      onClick={(e) => handleHeroClick(e, hero.file, hero.name, hero.id)}
                    >
                      {visitedHeroes.has(hero.id) ? 'Просмотрено' : 'Узнать историю →'}
                    </a>
                  </div>
                </div>
              ))}
              
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLScQXGlsYX0cc1dWeb8AUutmvu_XuT_2reoy-WajNQOhw-p3cA/viewform?usp=publish-editor" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hero-card variant-1 hero-card-add"
                style={{ textDecoration: 'none' }}
              >
                <div className="hero-card-inner">
                  <div className="hero-photo-icon hero-photo-icon-add"></div>
                  <h3 className="hero-name">Добавить героя</h3>
                  <p className="add-instruction">Заполните форму, и мы добавим вашего героя</p>
                </div>
              </a>
            </div>
          </div>
          <div className="scroll-hint"><span>←</span> листайте <span>→</span></div>
        </section>

        <section className="thanks-section">
          <div className="stars-section-container">
            {stars.current.map((star) => (
              <div 
                key={star.id} 
                className="star-section" 
                style={{ 
                  left: star.left, 
                  animationDelay: star.delay, 
                  animationDuration: star.duration 
                }} 
              />
            ))}
          </div>
          <div className="thanks-cloud" style={{ transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)` }}>
            <h2 className="thanks-title">
              Спасибо за светлое небо<br />над головой
            </h2>
            <p className="thanks-subtitle">
              Вечная память героям Великой Отечественной войны
            </p>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-content">
            <p>Проект создан учениками 10 классов</p>
            <p className="footer-year">2026</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;