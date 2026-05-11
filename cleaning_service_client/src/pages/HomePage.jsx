import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../page_styles/HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="home">
            <section className="home-hero">
                <div className="home-hero__text">
                    <p className="home-badge">Клининг премиум-класса</p>
                    <h1>Чистота без компромиссов — дом и офис за один визит</h1>
                    <p className="home-lead">
                        Подбираем бригаду под задачу, привозим профессиональную химию и контролируем результат.
                        Закажите уборку онлайн и следите за статусом в личном кабинете.
                    </p>
                    <div className="home-hero__cta">
                        <button type="button" className="btn-hero btn-hero--primary" onClick={() => navigate('/services')}>
                            Заказать уборку
                        </button>
                        <Link to="/login" className="btn-hero btn-hero--secondary">Войти в кабинет</Link>
                    </div>
                </div>
                <div className="home-hero__visual" aria-hidden>
                    <div className="home-hero__card">
                        <span className="home-stat__value">4.9</span>
                        <span className="home-stat__label">средняя оценка</span>
                    </div>
                </div>
            </section>

            <section className="home-stats">
                <div className="home-stat">
                    <span className="home-stat__value">1200+</span>
                    <span className="home-stat__label">уборок в год</span>
                </div>
                <div className="home-stat">
                    <span className="home-stat__value">48 ч</span>
                    <span className="home-stat__label">служба поддержки</span>
                </div>
                <div className="home-stat">
                    <span className="home-stat__value">100%</span>
                    <span className="home-stat__label">страхование работ</span>
                </div>
            </section>

            <section className="home-section">
                <h2>Как мы работаем</h2>
                <div className="home-steps">
                    <article className="home-step">
                        <span className="home-step__num">1</span>
                        <h3>Выбор услуги</h3>
                        <p>Каталог с ценами и описанием: генеральная, поддерживающая, окна, химчистка.</p>
                    </article>
                    <article className="home-step">
                        <span className="home-step__num">2</span>
                        <h3>Онлайн-заказ</h3>
                        <p>Укажите площадь, адрес и время — система рассчитает стоимость и зафиксирует заказ.</p>
                    </article>
                    <article className="home-step">
                        <span className="home-step__num">3</span>
                        <h3>Оценка и отзывы</h3>
                        <p>После визита оставьте оценку заказа и услуги — так мы поддерживаем качество.</p>
                    </article>
                </div>
            </section>

            <section className="home-gallery">
                <h2>Наши стандарты</h2>
                <div className="home-gallery__grid">
                    <figure className="home-gallery__item">
                        <img src={require('../images/image1.jpg')} alt="Уборка помещений" />
                        <figcaption>Аккуратная уборка жилых зон</figcaption>
                    </figure>
                    <figure className="home-gallery__item">
                        <img src={require('../images/image2.jpg')} alt="Чистые окна" />
                        <figcaption>Сияющие окна и фасады</figcaption>
                    </figure>
                    <figure className="home-gallery__item">
                        <img src={require('../images/image3.jpg')} alt="Команда клининга" />
                        <figcaption>Обученные специалисты</figcaption>
                    </figure>
                </div>
            </section>

            <section className="home-benefits">
                <h2>Почему CleanSpace</h2>
                <ul className="home-benefits__list">
                    <li><strong>Эко-составы</strong> — безопасно для детей и животных.</li>
                    <li><strong>Прозрачные цены</strong> — видите стоимость до подтверждения.</li>
                    <li><strong>Личный кабинет</strong> — заказы, профиль и история оценок в одном месте.</li>
                    <li><strong>Гарантия</strong> — переработка зоны при претензии в течение 24 часов.</li>
                </ul>
            </section>

            <section className="home-faq">
                <h2>Частые вопросы</h2>
                <div className="home-faq__grid">
                    <div className="faq-card">
                        <h3>Как записаться?</h3>
                        <p>Зарегистрируйтесь, выберите услугу в каталоге и оформите заказ с адресом и датой.</p>
                    </div>
                    <div className="faq-card">
                        <h3>Как считается цена?</h3>
                        <p>Базовая ставка за м² умножается на площадь; итог виден на экране до отправки заказа.</p>
                    </div>
                    <div className="faq-card">
                        <h3>Можно отменить заказ?</h3>
                        <p>Да, в разделе «Мои заказы» доступна отмена до выезда бригады.</p>
                    </div>
                </div>
            </section>

            <section className="home-cta">
                <h2>Готовы к чистоте без хлопот?</h2>
                <button type="button" className="btn-hero btn-hero--primary" onClick={() => navigate('/services')}>
                    Перейти к услугам
                </button>
            </section>
        </div>
    );
};

export default HomePage;
