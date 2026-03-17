import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
const womenInches = [
  { measure: 'US Size',           XS: '0-2',  S: '4-6',  M: '8-10', L: '12-14', XL: '16-18', XXL: '20-22' },
  { measure: 'Shoulder Width',    XS: '14.6', S: '15.4', M: '16.1', L: '16.9',  XL: '18.1',  XXL: '18.9'  },
  { measure: 'Bust',              XS: '31.5', S: '34.6', M: '37.8', L: '40.6',  XL: '44.1',  XXL: '48'    },
  { measure: 'Waist',             XS: '26.4', S: '28.7', M: '31.5', L: '33.9',  XL: '36.6',  XXL: '40.2'  },
  { measure: 'Hip',               XS: '35.4', S: '38.6', M: '41.7', L: '44.5',  XL: '47.2',  XXL: '50'    },
  { measure: 'Sleeve Length',     XS: '24.4', S: '25.4', M: '26.4', L: '27.4',  XL: '28.3',  XXL: '28.3'  },
  { measure: 'Shoulder to Waist', XS: '16.5', S: '16.9', M: '17.3', L: '17.7',  XL: '18.1',  XXL: '18.9'  },
  { measure: 'Waist to Floor',    XS: '38.6', S: '39.4', M: '40.2', L: '41.3',  XL: '42.5',  XXL: '43.3'  },
];

const menInches = [
  { measure: 'Shoulder Width', XS: '16.1', S: '17.3', M: '18.1', L: '18.9', XL: '19.7', XXL: '20.5' },
  { measure: 'Chest',          XS: '35.0', S: '37.8', M: '40.6', L: '43.3', XL: '46.1', XXL: '49.2' },
  { measure: 'Waist',          XS: '29.1', S: '31.9', M: '34.6', L: '37.4', XL: '40.2', XXL: '43.3' },
  { measure: 'Shirt Length',   XS: '27.6', S: '28.3', M: '29.1', L: '29.9', XL: '30.7', XXL: '31.5' },
  { measure: 'Sleeve Length',  XS: '24.0', S: '24.8', M: '25.6', L: '26.4', XL: '27.2', XXL: '28.0' },
  { measure: 'Rise',           XS: '11.0', S: '11.4', M: '11.8', L: '12.2', XL: '12.6', XXL: '13.0' },
  { measure: 'Thigh Width',    XS: '11.8', S: '12.6', M: '13.4', L: '14.2', XL: '15.0', XXL: '15.7' },
  { measure: 'Knee Width',     XS: '8.7',  S: '9.1',  M: '9.4',  L: '9.8',  XL: '10.2', XXL: '10.6' },
  { measure: 'Inseam Length',  XS: '29.1', S: '29.9', M: '30.7', L: '31.5', XL: '32.3', XXL: '33.1' },
  { measure: 'Outseam Length', XS: '40.2', S: '41.3', M: '42.5', L: '43.7', XL: '44.9', XXL: '46.1' },
  { measure: 'Leg Opening',    XS: '7.1',  S: '7.5',  M: '7.9',  L: '8.3',  XL: '8.7',  XXL: '9.1'  },
];

const toCm = (rows) =>
  rows.map((row) => ({
    ...row,
    XS:  row.XS.includes('-')  ? row.XS  : (parseFloat(row.XS)  * 2.54).toFixed(1),
    S:   row.S.includes('-')   ? row.S   : (parseFloat(row.S)   * 2.54).toFixed(1),
    M:   row.M.includes('-')   ? row.M   : (parseFloat(row.M)   * 2.54).toFixed(1),
    L:   row.L.includes('-')   ? row.L   : (parseFloat(row.L)   * 2.54).toFixed(1),
    XL:  row.XL.includes('-')  ? row.XL  : (parseFloat(row.XL)  * 2.54).toFixed(1),
    XXL: row.XXL.includes('-') ? row.XXL : (parseFloat(row.XXL) * 2.54).toFixed(1),
  }));

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const BRAND = '#D4AF37';

function UnitToggle({ unit, onChange }) {
  return (
    <div className="inline-flex border border-gray-200 rounded-lg overflow-hidden mb-4">
      {['inches', 'cm'].map((u) => (
        <button
          key={u}
          onClick={() => onChange(u)}
          style={unit === u ? { backgroundColor: BRAND, color: '#fff' } : {}}
          className={`px-5 py-1.5 text-sm font-medium transition-colors duration-150 ${
            unit === u ? '' : 'bg-white text-gray-500 hover:text-gray-900'
          }`}
        >
          {u === 'inches' ? 'Inches' : 'CM'}
        </button>
      ))}
    </div>
  );
}

function SizeTable({ data }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 text-gray-500 font-medium min-w-[160px]">Measurement</th>
            {SIZES.map((s) => (
              <th key={s} className="px-4 py-3 font-semibold text-center" style={{ color: BRAND }}>{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.measure} className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
              <td className="px-4 py-3 text-gray-700 font-medium">{row.measure}</td>
              {SIZES.map((s) => (
                <td key={s} className="px-4 py-3 text-gray-600 text-center">{row[s]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HowToMeasure({ steps }) {
  return (
    <ul className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3 text-sm text-gray-600">
          <span
            className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full text-white text-xs flex items-center justify-center font-semibold"
            style={{ backgroundColor: BRAND }}
          >
            {i + 1}
          </span>
          <span>
            <strong className="text-gray-900">{step.title}</strong> — {step.desc}
          </span>
        </li>
      ))}
    </ul>
  );
}

const womenSteps = [
  { title: 'Shoulder Width', desc: 'Measure straight across the back from one shoulder point to the other.' },
  { title: 'Bust',           desc: 'Wrap the tape around the fullest part of your chest, parallel to the floor.' },
  { title: 'Waist',          desc: 'Measure around the narrowest part of your waist, just above the belly button.' },
  { title: 'Sleeve Length',  desc: 'From the top of the shoulder down to the wrist with your arm slightly bent.' },
  { title: 'Dress Length',   desc: 'From the top of the waist straight down to the floor.' },
];

const menSteps = [
  { title: 'Shoulder Width',  desc: 'Measure straight across the back from shoulder seam to shoulder seam.' },
  { title: 'Chest',           desc: 'Wrap the tape under the arms around the fullest part of the chest.' },
  { title: 'Waist',           desc: 'Measure around the natural waistline, keeping the tape comfortably loose.' },
  { title: 'Sleeve Length',   desc: 'From the shoulder point down to the wrist with a slight bend at the elbow.' },
  { title: 'Rise',            desc: 'From the top waistband down to the crotch seam while seated.' },
  { title: 'Outseam Length',  desc: 'From the top of the waistband down the outer leg to the ankle.' },
  { title: 'Thigh ',    desc: 'Measure around the fullest part of the thigh while standing.' },
];

export default function SizeGuide() {
  const [womenUnit, setWomenUnit] = useState('inches');
  const [menUnit,   setMenUnit]   = useState('inches');

  return (
    <>
      <Helmet>
        <title>Size Chart & Measurement Guide | Diamond Design</title>
        <meta name="description" content="Use Diamond Design's size guide to find your perfect Habesha Kemis fit. Detailed measurements for women's and men's collections." />
        <link rel="canonical" href="https://www.diamonddesignstore.com/size-guide" />
      </Helmet>

      <div className="bg-white text-gray-900 min-h-screen">

        {/* Page title */}
        <div className="border-b border-gray-100 pt-38 pb-7 text-center">
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Size Chart &amp; Measurement Guide
          </h1>
          <p className="mt-2 text-gray-500 text-sm max-w-md mx-auto" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}>
            
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 pb-20">

          {/* ── WOMEN'S ── */}
          <section>
            <h2 className="text-lg font-semibold mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Women's Size Guide
            </h2>
            <p className="text-gray-400 text-sm mb-6" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}>
              For our Habesha Kemis women's collection.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-start">
              <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                <img src="/images/sizing.png" alt="Women's sizing diagram" className="w-full object-contain" />
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3"
                  style={{ fontFamily: 'Roboto, sans-serif' }}>
                  How to Measure
                </h3>
                <HowToMeasure steps={womenSteps} />
                <p className="mt-4 text-xs text-gray-400 border-t border-gray-100 pt-3"
                  style={{ fontFamily: 'Roboto, sans-serif' }}>
                  💡 If you are between sizes, we recommend going one size up.
                </p>
              </div>
            </div>

            <UnitToggle unit={womenUnit} onChange={setWomenUnit} />
            <SizeTable data={womenUnit === 'inches' ? womenInches : toCm(womenInches)} />
          </section>

          <hr className="border-gray-100" />

          {/* ── MEN'S ── */}
          <section>
            <h2 className="text-lg font-semibold mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Men's Size Guide
            </h2>
            <p className="text-gray-400 text-sm mb-6" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}>
              For our Habesha men's shirt and trouser collection.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-start">
              <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                <img src="/images/man.png" alt="Men's sizing diagram" className="w-full object-contain" />
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3"
                  style={{ fontFamily: 'Roboto, sans-serif' }}>
                  How to Measure
                </h3>
                <HowToMeasure steps={menSteps} />
                <p className="mt-4 text-xs text-gray-400 border-t border-gray-100 pt-3"
                  style={{ fontFamily: 'Roboto, sans-serif' }}>
                  💡 When between sizes, choose the larger size for a more comfortable traditional drape.
                </p>
              </div>
            </div>

            <UnitToggle unit={menUnit} onChange={setMenUnit} />
            <SizeTable data={menUnit === 'inches' ? menInches : toCm(menInches)} />
          </section>

          {/* ── CTA ── */}
          <div className="text-center border-t border-gray-100 pt-10">
            <p className="text-gray-500 text-sm mb-4" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}>
              Still not sure about your size?
            </p>
          <Link
  to="/contact"
  className="inline-block bg-brand text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20"
  style={{ fontFamily: 'Roboto, sans-serif' }}
>
  Contact Us
</Link>
          </div>

        </div>
      </div>
    </>
  );
}